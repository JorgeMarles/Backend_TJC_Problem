import ampq from 'amqplib';
import { RABBITMQ_HOST, RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_USERNAME } from '../config';
import { createOrUpdateSubmission, SubmissionUpdateInfo } from './SubmissionServices';
import { createUserBase } from './UserService';

type QueueInfo = {
    type: string,
    exchange: string,
    arguments: {
        [key: string]: any
    }
}

type QueueOutData = {
    info?: QueueInfo,
    queue: ampq.Replies.AssertQueue | null,
}

type QueueInData = {
    info?: QueueInfo,
    queue: ampq.Replies.AssertQueue | null,
    consume: (channel: ampq.Channel, msg: ampq.ConsumeMessage | null) => Promise<any>
}

type RabbitMQUtils = {
    queuesOut: {
        [key: string]: QueueOutData
    },
    queuesIn?: {
        [key: string]: QueueInData
    }
    channel: ampq.Channel | null
}

const DEFAULT_ALL_UP_TO = false;
const DEFAULT_REQUEUE = false;

const rmq: RabbitMQUtils = {
    queuesOut: {
        'problem-stats': {
            queue: null
        },
        'problem-creation': {
            queue: null
        },
        'submission-save': {
            queue: null
        }
    },
    queuesIn: {
        'submission-update': {
            queue: null,
            consume: async (channel, msg) => {
                if (!msg) return;
                try {
                    const data: SubmissionUpdateInfo = JSON.parse(msg.content.toString()) as SubmissionUpdateInfo;
                    console.log(`Saving info of submission ${data.id}`);
                    await createOrUpdateSubmission(data);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error saving info of submission:', error)
                    channel.nack(msg, DEFAULT_ALL_UP_TO, DEFAULT_REQUEUE)
                }
            }
        },
        'user-creation': {
            queue: null,
            consume: async (channel, msg) => {
                if (!msg) return;
                try {
                    const {
                        userId
                    }: {
                        userId: number
                    } = JSON.parse(msg.content.toString());

                    console.log(`Creating user with id ${userId}`);
                    await createUserBase(userId);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error creating user:', error)
                    channel.nack(msg, DEFAULT_ALL_UP_TO, DEFAULT_REQUEUE)
                }
            }
        }
    },
    channel: null
}
export const connectRabbitMQ = async () => {
    try {
        console.log('Connecting to RabbitMQ at', getRabbitMQURL(), '...');

        const connection = await ampq.connect(getRabbitMQURL());
        const channel = await connection.createChannel();

        // Configurar colas de salida
        for (const key in rmq.queuesOut) {
            const queue = key;
            
            if (rmq.queuesOut[key].info) {
                const { type, exchange } = rmq.queuesOut[key].info;
                await channel.assertExchange(exchange, type, { 
                    durable: true, 
                    arguments: rmq.queuesOut[key].info.arguments 
                });
                
                // Para fanout, no necesitamos crear la cola aquí
                if (type !== 'fanout') {
                    rmq.queuesOut[key].queue = await channel.assertQueue(queue, { durable: true });
                    await channel.bindQueue(queue, exchange, key);
                }
            } else {
                rmq.queuesOut[key].queue = await channel.assertQueue(queue, { durable: true });
            }
            
            console.log(`Queue ${queue} is ready`);
        }

        // Configurar colas de entrada
        for (const key in rmq.queuesIn) {
            let queueName = key;
            
            // Para user-creation, crear una cola específica para este microservicio
            if (key === 'user-creation') {
                // Declarar el exchange fanout
                await channel.assertExchange('user-broadcast', 'fanout', { durable: true });
                
                // Crear cola específica para el microservicio de contests
                queueName = 'user-creation-problems';
                const queue = await channel.assertQueue(queueName, { 
                    durable: true,
                    exclusive: false 
                });
                
                // Vincular la cola al exchange
                await channel.bindQueue(queue.queue, 'user-broadcast', '');
                rmq.queuesIn[key].queue = queue;
            } else {
                rmq.queuesIn[key].queue = await channel.assertQueue(queueName, { durable: true });
            }
            
            channel.consume(queueName, async (msg) => rmq.queuesIn![key].consume(channel, msg), { noAck: false });
            console.log(`Consumer for ${queueName} is ready`);
        }

        rmq.channel = channel;

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

type ProblemCreationMessage = {
    problemId: number
}

type SubmissionSaveMessage = {
    submissionId: string
}

type TopicMessage = {
    type: "topic";
    data: {
        topicId: number;
        topicName: string;
    };
}

type ProblemMessage = {
    type: "problem";
    data: {
        problemId: number;
        problemName: string;
        topicId: number;
        difficulty: string;
    };
}



type Message = TopicMessage | ProblemMessage | ProblemCreationMessage | SubmissionSaveMessage;

export const sendProblemMessage = async (problemId: number, problemName: string, topicId: number, difficulty: string) => {
    const message: Message = {
        type: "problem",
        data: {
            problemId,
            problemName,
            topicId,
            difficulty,
        }
    }
    await publishMessage('problem-stats', JSON.stringify(message));
    console.log(`Problem ${problemId} registered`);
}

export const sendTopicMessage = async (topicId: number, topicName: string) => {
    const message: Message = {
        type: "topic",
        data: {
            topicId,
            topicName
        }
    }
    await publishMessage('problem-stats', JSON.stringify(message));
    console.log(`Topic message for topic ${topicId} sent`);
}

export const sendProblemCreationMessage = async (problemId: number) => {
    const message: ProblemCreationMessage = {
        problemId
    }

    await publishMessage('problem-creation', JSON.stringify(message))
    console.log(`Problem creation message for id ${problemId} sent`)
}

export const sendSubmissionSaveMessage = async (submissionId: string) => {
    const message: SubmissionSaveMessage = {
        submissionId
    }

    await publishMessage('submission-save', JSON.stringify(message))
    console.log(`Submission save message for id ${submissionId} sent`)
}

const publishMessage = async (queue: string, message: string, options?: ampq.Options.Publish) => {
    try {
        const queueObj: ampq.Replies.AssertQueue | null = rmq.queuesOut[queue].queue;
        if (!queueObj || !rmq.channel) {
            throw new Error(`Either the Channel or the Queue ${queue} is not initialized or does not exist.`);
        }
        rmq.channel.sendToQueue(queueObj.queue, Buffer.from(message), { ...options, persistent: true });
    } catch (error) {
        console.error(`Error publishing message in queue ${queue} to RabbitMQ:`, error);
        throw error;
    }
}

const getRabbitMQURL = () => {
    return `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;
}