# Usa imagem leve do Node baseada no Alpine
FROM node:18-alpine

# Instala Chromium e dependências necessárias para o whatsapp-web.js
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

# Define o caminho executável do Chromium (para o Puppeteer usar)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install && npm install -g ts-node

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta da aplicação
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["node", "dist/server.js"]
