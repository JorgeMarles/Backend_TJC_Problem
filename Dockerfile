#Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json .

COPY public.key /app/public.key

RUN npm install

COPY . .

RUN npm run build

#Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json .

COPY public.key /app/public.key

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

EXPOSE 8081

CMD ["node", "dist/index.js"]