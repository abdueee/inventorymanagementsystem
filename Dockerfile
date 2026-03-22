#This is the base image ( app is using Node + Next )
FROM node:20-bookworm-slim AS base

# Disable Next.js telemetry in the container.
ENV NEXT_TELEMETRY_DISABLED=1

# Install project dependencies in a separate layer so Docker can cache them.
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Build the application and generate the Prisma client used by the app.
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Create a smaller production image with only the built app artifacts.
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run the app as a non-root user for better container security.
RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

# Copy the standalone server, static assets, and public files into the runtime image.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Start the Next.js standalone server.
CMD ["node", "server.js"]
