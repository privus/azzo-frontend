# Usa a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia o arquivo de dependências para o container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código do projeto para o diretório de trabalho
COPY . .

# Exponha a porta que o Angular utiliza para rodar o servidor de desenvolvimento
EXPOSE 4200

# Comando para rodar o servidor de desenvolvimento do Angular
CMD ["npm", "run", "start"]