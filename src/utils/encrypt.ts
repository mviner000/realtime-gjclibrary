import CryptoJS from 'crypto-js';

class Encrypter {
  private secretKey: CryptoJS.lib.WordArray;
  private iv: CryptoJS.lib.WordArray;

  constructor() {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const iv = process.env.NEXT_PUBLIC_IV;

    if (!secretKey || !iv) {
      throw new Error('Secret key and IV must be provided via environment variables.');
    }

    this.secretKey = CryptoJS.enc.Utf8.parse(secretKey);
    this.iv = CryptoJS.enc.Utf8.parse(iv);

    this.validateKeyAndIv();
  }

  private validateKeyAndIv() {
    const keySize = this.secretKey.sigBytes;
    const ivSize = this.iv.sigBytes;

    // AES key sizes: 128 (16 bytes), 192 (24 bytes), 256 (32 bytes)
    if (keySize !== 16 && keySize !== 24 && keySize !== 32) {
      throw new Error('Secret key must be 16, 24, or 32 bytes long.');
    }

    // AES block size: 128 bits (16 bytes)
    if (ivSize !== 16) {
      throw new Error('IV must be 16 bytes long.');
    }
  }

  encrypt(plainText: string): string {
    const encrypted = CryptoJS.AES.encrypt(plainText, this.secretKey, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    return encrypted;
  }
}

export default Encrypter;
