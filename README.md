# HolitechBot

Telegram bot loyihasi.

## Docker bilan ishga tushirish

1. **`.env` fayl yarating** (loyiha ildizida) va kamida quyidagilarni to'ldiring:
   - `BOT_TOKEN`, `BOT_USERNAME`, `LOG_BOT_TOKEN`, `ADMIN_ID`
   - Lokal ishlatgan bo'lsangiz, `.env.development` ni `.env` ga nusxalab Docker uchun ishlatishingiz mumkin.

2. **Docker Compose bilan ishga tushiring:**
   ```bash
   docker compose up -d --build
   ```
   Birinchi marta image build qilinadi, MongoDB va bot konteynerda ishga tushadi.

3. **Konteynerlarni to'xtatish:**
   ```bash
   docker compose down
   ```

4. **Loglarni ko'rish:**
   ```bash
   docker compose logs -f app
   ```

**Eslatma:** Docker'da MongoDB avtomatik ishga tushadi va `MONGO_URL=mongodb://mongo:27017/holitech` o'rnatiladi. Tashqi MongoDB ishlatmoqchi bo'lsangiz, `docker-compose.yml` da `MONGO_URL` ni o'zgartiring yoki `.env` da belgilang.
