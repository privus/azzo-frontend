# Etapa de build para o Angular
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências para o container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o código do projeto para o diretório de trabalho
COPY . .

# Gera o build de produção do Angular
RUN npm run build -- --output-path=dist

# Usa a imagem do Nginx para servir o aplicativo estático
FROM nginx:alpine

# Copia os arquivos construídos do Angular para o diretório padrão do Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Inicia o Nginx para servir o aplicativo Angular
CMD ["nginx", "-g", "daemon off;"]
