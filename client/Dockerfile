# client/Dockerfile

# Stage 1: Build the React App
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Point Vite to the backend (localhost in browser context)
ENV VITE_API_BASE_URL=http://localhost:5000/api/v1
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Config for React Router (redirects all requests to index.html)
RUN echo 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]