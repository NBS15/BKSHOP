# Root Dockerfile: build and run the Backend service
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install deps for backend
COPY Backend/package*.json ./Backend/
RUN cd Backend && npm ci --silent

# Copy backend source and build
COPY Backend/ ./Backend/
RUN cd Backend && npm run build --silent

FROM node:18-alpine
WORKDIR /app/Backend
ENV NODE_ENV=production

# Copy production files from builder
COPY --from=builder /app/Backend/dist ./dist
COPY Backend/package*.json ./

# Install production deps
RUN npm ci --production --silent || true

EXPOSE 5000
CMD ["npm","start"]
