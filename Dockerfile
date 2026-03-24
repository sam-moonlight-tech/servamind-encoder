# Build stage
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

COPY . .

# Build args for environment variables (baked in at build time)
ARG VITE_API_URL
ARG VITE_AUTH_PROVIDER=mock
ARG VITE_GOOGLE_CLIENT_ID=
ARG VITE_ENABLE_GOOGLE_DRIVE_UPLOAD=false
ARG VITE_SHOW_GOOGLE_DRIVE_UPLOAD=false
ARG VITE_SHOW_UPLOAD_METRICS=false
ARG VITE_SHOW_COMPRESSION_METRICS=true
ARG VITE_SYSTEM_DOWN=false
ARG VITE_DEMO_MODE=false
ARG VITE_STRIPE_PUBLISHABLE_KEY=

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_PROVIDER=$VITE_AUTH_PROVIDER
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

# Production stage
FROM nginx:alpine
RUN apk add --no-cache wget
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
