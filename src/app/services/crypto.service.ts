import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  /**
   * Hash the rawString with SHA256.
   * 
   * @param rawString 
   * @returns tha hash
   */
  hashString(rawString: string): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(sha256(rawString).toString());
    });
  }

  /**
   * Encrypt a set of messages with the secret and AES.
   * 
   * @param messages
   * @param secret 
   * @returns encrypted messages
   */
  encrypt(messages: string[], secret: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      resolve(messages.map((message: string) => {
        return aes.encrypt(message, secret).toString();
      }));
    })
  }

  /**
   * Decrypt a set of messages with the secret and AES.
   * 
   * @param messages 
   * @param secret 
   * @returns decrypted messages
   */
  decrypt(messages: string[], secret: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      resolve(messages.map((message: string) => {
        return aes.decrypt(message, secret).toString(enc)
      }));
    });
  }
}
