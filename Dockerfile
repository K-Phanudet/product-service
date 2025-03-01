
FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx nest build

FROM node:22-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8085
CMD ["node", "dist/main"]
