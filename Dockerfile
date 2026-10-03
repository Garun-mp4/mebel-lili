FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/server.mjs ./server.mjs
EXPOSE 4173
CMD ["node", "server.mjs"]
