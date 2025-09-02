FROM node:24
WORKDIR /app

# Helpful defaults for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# Seed node_modules into the named volume on first run
COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3003

CMD ["npm", "run", "dev"]
