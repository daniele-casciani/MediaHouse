FROM node:18

WORKDIR /app

# Copia i file necessari
COPY package*.json ./
RUN npm install

# Copia il resto
COPY . .

# Espone la porta usata dal dev server
EXPOSE 3000

# Avvia il dev server React
CMD ["sh", "-c", "npm start > /app/logs/stdout.log 2>&1"]

