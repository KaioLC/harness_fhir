FROM node:20-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./

RUN pnpm i

COPY . .

EXPOSE 5173

CMD ["pnpm, "dev", "--host", "0.0.0.0", "--port", "5173"]
