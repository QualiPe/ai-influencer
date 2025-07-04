FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]