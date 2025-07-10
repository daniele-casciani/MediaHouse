FROM node:18

WORKDIR /app

# Install dependencies
RUN apt-get update

# Copy package.json and tsconfig.json first to leverage Docker cache
COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

# Build TypeScript
RUN npm run build

CMD ["sh", "-c", "npm start > /app/logs/stdout.log 2>&1"]

