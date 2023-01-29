import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  hashString(rawString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(sha256(rawString).toString());
    });
  }

  encrypt(message: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(aes.encrypt(message, secret).toString());
    })
  }

  decrypt(encryptedMessage: string, secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(aes.decrypt(encryptedMessage, secret).toString(enc));
    })
  }
}
