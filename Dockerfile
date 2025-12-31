FROM node:20-alpine

# Instala dependências essenciais + Google Chrome
RUN apt-get update && apt-get install -y \
  wget gnupg ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 \
  libatk1.0-0 libcups2 libdbus-1-3 libdrm2 libxkbcommon0 libxdamage1 libxrandr2 libgbm1 libxcomposite1 \
  libxfixes3 libxext6 libnss3 libx11-xcb1 libxshmfence1 libgtk-3-0 libxcb-dri3-0 libu2f-udev xdg-utils \
  fonts-noto-color-emoji && \
  rm -rf /var/lib/apt/lists/*

# Baixa e instala o Chrome estável
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && apt-get install -y google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

# Define diretório de trabalho
WORKDIR /app

# Copia dependências
COPY package*.json ./

# Instala dependências do Node
RUN npm install && npm install -g ts-node

# Copia o código
COPY . .

# Compila o TypeScript
RUN npm run build

# Exponha a porta
EXPOSE 3000

# Comando inicial
CMD ["node", "dist/server.js"]
