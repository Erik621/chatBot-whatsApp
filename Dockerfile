# Usando a imagem oficial do Node.js
FROM node:alpine

RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    udev \
    bash

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium


# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install && npm install -g ts-node

# Copiar o restante do código para o container
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

# Comando para manter o container rodando e permitir execução de comandos
CMD ["node","dist/server.js"]

