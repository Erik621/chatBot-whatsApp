FROM node:20-slim

ENV DEBIAN_FRONTEND=noninteractive

# Dependências necessárias para Puppeteer / Chrome
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libxkbcommon0 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libxcomposite1 \
  libxfixes3 \
  libxext6 \
  libnss3 \
  libx11-xcb1 \
  libxshmfence1 \
  libgtk-3-0 \
  libxcb-dri3-0 \
  libu2f-udev \
  xdg-utils \
  fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

# Instala Google Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub \
  | gpg --dearmor -o /usr/share/keyrings/google-linux-keyring.gpg && \
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
  > /etc/apt/sources.list.d/google-chrome.list && \
  apt-get update && apt-get install -y google-chrome-stable && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia dependências primeiro
COPY package*.json ./

# Instala dependências (inclui @types)
RUN npm install

# Copia o restante do código
COPY . .

# Compila TypeScript → gera /dist
RUN npm run build

RUN cp src/modules/scripts/model.nlp dist/modules/scripts/model.nlp

EXPOSE 3000

CMD ["node", "dist/server.js"]
