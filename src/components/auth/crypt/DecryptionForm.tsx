import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const secretKeyFromENV: string = process.env.NEXT_PUBLIC_SECRET_KEY as string;
const ivFromENV: string = process.env.NEXT_PUBLIC_IV as string;

const DecryptionForm: React.FC = () => {
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [error, setError] = useState('');
  
  const secretKey = CryptoJS.enc.Utf8.parse(secretKeyFromENV);
  const iv = CryptoJS.enc.Utf8.parse(ivFromENV);

  const handleDecrypt = () => {
    try {
      if (!encryptedText) {
        throw new Error('Encrypted text cannot be empty.');
      }

      // Decrypting the text using AES with CBC mode and PKCS5 padding
      const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7, // PKCS5Padding is implemented as Pkcs7 in crypto-js
      });

      if (!bytes) {
        throw new Error('Decryption failed: Invalid encrypted text, key, or IV.');
      }

      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        throw new Error('Decryption failed: Invalid encrypted text, key, or IV.');
      }

      setDecryptedText(decrypted);
      setError('');
    } catch (err) {
      console.error(err);
      setDecryptedText('');
      setError((err as Error).message || 'An unknown error occurred during decryption.');
    }
  };

  return (
    <div>
      <h2 className='text-purple-500 font-semibold'>Decrypt Text</h2>
      <div>
        <Label htmlFor="encryptedText">Enter Encrypted Text:</Label>
        <Textarea
          id="encryptedText"
          value={encryptedText}
          onChange={(e) => setEncryptedText(e.target.value)}
          rows={4}
          cols={50}
        />
      </div>
      <Button className='my-4' onClick={handleDecrypt}>Decrypt</Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {decryptedText && (
        <div>
          <h3>Decrypted Text:</h3>
          <textarea value={decryptedText} readOnly rows={4} cols={50} />
        </div>
      )}
    </div>
  );
};

export default DecryptionForm;