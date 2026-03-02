FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Set production API URL
ENV VITE_API_URL=https://portfolio-backend-1095465864763.us-central1.run.app/api

RUN npm run build

# Verify public files are in dist
RUN ls -la /app/dist/

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
