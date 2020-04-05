require('dotenv').config();

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "connectionString": DATABASE_URL,
  "ssl": !!process.env.SSL
}