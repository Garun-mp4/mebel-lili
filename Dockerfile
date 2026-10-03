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
COPY --from=build /app/server ./server
COPY --from=build /app/legal ./legal
COPY --from=build /app/src/legal-documents.mjs ./src/legal-documents.mjs
COPY --from=build /app/scripts/leads-admin.mjs ./scripts/leads-admin.mjs
EXPOSE 4173
USER node
CMD ["node", "server.mjs"]
