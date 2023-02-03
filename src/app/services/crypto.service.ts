import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';
import { RuntimeDocument } from '../model/runtime-document';

export interface MessageTuples {
  [key: string]: string;
}

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
  encrypt(messages: MessageTuples, secret: string): Promise<MessageTuples> {
    return new Promise((resolve, reject) => {
      Object.keys(messages).forEach((messageKey: string) => {
        messages[messageKey] = aes.encrypt(messages[messageKey], secret).toString();
      });
      resolve(messages);
    })
  }

  /**
   * Decrypt a set of messages with the secret and AES.
   * 
   * @param messages 
   * @param secret 
   * @returns decrypted messages
   */
  decrypt(messages: MessageTuples, secret: string): Promise<MessageTuples> {
    return new Promise((resolve, reject) => {
      Object.keys(messages).forEach((messageKey: string) => {
        messages[messageKey] = aes.decrypt(messages[messageKey], secret).toString(enc);
      });
      resolve(messages);
    });
  }

  decryptRuntimeDocument(document: RuntimeDocument, keys: string[], secret: string): Promise<RuntimeDocument> {
    return new Promise((resolve, reject) => {
      const 
    });
  }
}
