# Usando a imagem oficial do Node.js
FROM node:alpine

# Instala o Google Chrome
RUN apt-get update && apt-get install -y wget gnupg \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
    && apt-get update && apt-get install -y google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*


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

