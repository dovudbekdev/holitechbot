# Node 20 LTS (buffer-equal-constant-time va boshqa paketlar uchun)
FROM node:20-alpine

WORKDIR /app

# package.json va package-lock.json nusxalash
COPY package.json package-lock.json ./

# Production dependencies o'rnatish (devDependencies olinmaydi)
RUN npm ci --omit=dev

# Loyiha fayllarini nusxalash
COPY . .

# Production rejimida ishlatish
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
