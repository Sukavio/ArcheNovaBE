FROM node:20 AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/build/ /app
COPY --from=build /app/package.json /app
RUN npm install
ENTRYPOINT ["node"]