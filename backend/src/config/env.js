const dotenv = require('dotenv');
const path = require('path');
const dns = require('node:dns');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoDnsServers = (process.env.MONGO_DNS_SERVERS || '')
  .split(',')
  .map((server) => server.trim())
  .filter(Boolean);

if (mongoDnsServers.length > 0) {
  dns.setServers(mongoDnsServers);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  OTP_EXPIRY: parseInt(process.env.OTP_EXPIRY, 10) || 300,
};

// Validate critical environment variables
const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
requiredEnv.forEach((name) => {
  if (!env[name]) {
    throw new Error(`Environment variable ${name} is missing`);
  }
});

module.exports = env;
