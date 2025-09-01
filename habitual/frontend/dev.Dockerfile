FROM node:24-alpine
WORKDIR /app

# Helpful defaults for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# Install dependencies for faster iterative builds
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

