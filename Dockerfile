# Usando a imagem oficial do Node.js
FROM node:alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar os arquivos package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código para o container
COPY . .

# Comando para manter o container rodando e permitir execução de comandos
CMD ["npm", "run", "dev"]
