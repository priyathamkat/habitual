FROM node:24-alpine
WORKDIR /app

# Helpful defaults for development
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

EXPOSE 3003
# No build-time installs; volume will mount source and node_modules
CMD ["npm", "run", "dev"]
