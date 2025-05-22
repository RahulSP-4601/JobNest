# 1. Use official Node.js image
FROM node:18-alpine as build

# 2. Set working directory
WORKDIR /app

# 3. Copy and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy all source code
COPY . .

# 5. Build the Vite app (React + Tailwind)
RUN npm run build

# 1–5 unchanged … build with node …

# 6. Serve with Nginx
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
