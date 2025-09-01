# Multi-stage Dockerfile for Next.js (Node 20)
# Builds the app and runs `next start` on port 3003.

FROM node:24-alpine AS base
WORKDIR /app

# Install dependencies (with dev deps) for building
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Build the Next.js app
FROM base AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
WORKDIR /app

# Copy only what's needed to run `next start`
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json ./

# Prune dev dependencies to slim the image
RUN npm prune --omit=dev

EXPOSE 3003
CMD ["npm", "run", "start"]