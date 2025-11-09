const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = process.env.PAYMENT_INTEGRATION_DECRYPT_KEY;

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(secretKey, 'hex');
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  }
}

export const decrypt = (hash) => {
  const key = Buffer.from(secretKey, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString()
}