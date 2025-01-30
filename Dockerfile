# Etapa 1: Construir a aplicação Angular
FROM node:18 AS build

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência e instalar
COPY package*.json ./
RUN npm install

# Copiar código da aplicação e construir em modo produção
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Configurar o Nginx para servir os arquivos estáticos
FROM nginx:stable-alpine

# Remover configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copiar a configuração personalizada do Nginx com o nome correto
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos Angular para o diretório padrão do Nginx
COPY --from=build /app/dist/demo1 /usr/share/nginx/html

# Expor a porta usada pelo Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
