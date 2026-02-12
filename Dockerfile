FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts || npm install --ignore-scripts

COPY . .
RUN npm run build

ENTRYPOINT ["node", "dist/packages/cli/src/index.js"]
CMD ["--help"]
