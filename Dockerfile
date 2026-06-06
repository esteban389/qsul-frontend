FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts
COPY . .
# Security: eliminar cualquier binario ELF que no deba estar aquí
RUN find /app -maxdepth 2 -type f -executable \
    | xargs file 2>/dev/null \
    | grep ELF | cut -d: -f1 | xargs rm -fv || true
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
