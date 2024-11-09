import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const secretKeyFromENV: string = process.env.NEXT_PUBLIC_SECRET_KEY as string;
const ivFromENV: string = process.env.NEXT_PUBLIC_IV as string;

const EncryptionForm: React.FC = () => {
  const [plainText, setPlainText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');

  const secretKey = CryptoJS.enc.Utf8.parse(secretKeyFromENV);
  const iv = CryptoJS.enc.Utf8.parse(ivFromENV);

  const handleEncrypt = () => {
    // Encrypting the text using AES with CBC mode, PKCS5 padding, and base64 output format
    const encrypted = CryptoJS.AES.encrypt(plainText, secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7, // PKCS5Padding is implemented as Pkcs7 in crypto-js
    }).toString();

    setEncryptedText(encrypted);
  };

  return (
    <div>
      <h2 className='text-green-500 font-semibold'>Encrypt Text</h2>
      <div>
        <Label htmlFor="plainText">Enter Plain Text to Encrypt:</Label>
        <Input
          type="text"
          id="plainText"
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)}
        />
      </div>
      <Button className='my-4' onClick={handleEncrypt}>Encrypt</Button>
      {encryptedText && (
        <div>
          <h3>Encrypted Text:</h3>
          <textarea value={encryptedText} readOnly rows={4} cols={50} />
        </div>
      )}
    </div>
  );
};

export default EncryptionForm;
