import ampq from 'amqplib';
import { RABBITMQ_HOST, RABBITMQ_PASSWORD, RABBITMQ_PORT, RABBITMQ_USERNAME } from '../config';

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

const rmq: RabbitMQUtils = {
    queuesOut: {
        'contest-stats': {
            queue: null,
        },
        'contest-end': {
            info: {
                type: 'x-delayed-message',
                exchange: 'contest-delayed',
                arguments: {
                    'x-delayed-type': 'direct'
                }
            },
            queue: null,
        }
    },
    channel: null
}

export const connectRabbitMQ = async () => {
    try {
        console.log('Connecting to RabbitMQ at', getRabbitMQURL(), '...');

        const connection = await ampq.connect(getRabbitMQURL());
        const channel = await connection.createChannel();

        for (const key in rmq.queuesOut) {
            const queue = key;
            rmq.queuesOut[key].queue = await channel.assertQueue(queue, { durable: true });
            if (rmq.queuesOut[key].info) {
                const { type, exchange } = rmq.queuesOut[key].info;
                await channel.assertExchange(exchange, type, { durable: true, arguments: rmq.queuesOut[key].info.arguments });
                await channel.bindQueue(queue, exchange, key);
            }
            console.log(`Queue ${queue} is ready`);
        }

        for (const key in rmq.queuesIn) {
            const queue = key;
            rmq.queuesIn[key].queue = await channel.assertQueue(queue, { durable: true });
            channel.consume(queue, async (msg) => rmq.queuesIn![key].consume(channel, msg), { noAck: false });
        }

        rmq.channel = channel;

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}


type TopicData = {
    topicId: number;
    topicName: string;
}

type ProblemData = {
    problemId: number;
    problemName: string;
    topicId: number;
    difficulty: string;
}

type TopicMessage = {
    type: "topic";
    data: TopicData;
}

type ProblemMessage = {
    type: "problem";
    data: ProblemData;
}

type Message = TopicMessage | ProblemMessage;

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