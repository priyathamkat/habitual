FROM node:24-alpine
WORKDIR /app

# Helpful defaults for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# Install dependencies at build time so the named volume gets seeded
COPY package.json package-lock.json ./
RUN npm ci

EXPOSE 3003
CMD ["npm", "run", "dev"]
