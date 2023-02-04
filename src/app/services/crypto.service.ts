import { Injectable } from '@angular/core';
import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';
import { RuntimeDocument } from '../model/runtime-document';
import { EncryptedDocument } from '../model/base-document';
import { EncryptedUserConf } from '../model/storage/encrypted-user-conf';
import { EncryptedSpaceConf } from '../model/storage/encrypted-space-conf';
import { EncryptedRemoteWorkspace } from '../model/storage/encrypted-remote-workspace';
import { EncryptedFolder } from '../model/storage/encrypted-folder';
import { EncryptedNote } from '../model/storage/encrypted-note';
import { EncryptedFile } from '../model/storage/encrypted-file';

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
  encryptMessages(messages: MessageTuples, secret: string): Promise<MessageTuples> {
    return new Promise((resolve, reject) => {
      Object.keys(messages).forEach((messageKey: string) => {
        messages[messageKey] = this.encrypt(messages[messageKey], secret);
      });
      resolve(messages);
    })
  }

  /**
   * Encrypt a single string
   * 
   * @param message 
   * @param secret 
   * @returns 
   */
  encrypt(message: string, secret: string): string {
    return aes.encrypt(message, secret).toString();
  }

  /**
   * Decrypt a set of messages with the secret and AES.
   * 
   * @param messages 
   * @param secret 
   * @returns decrypted messages
   */
  decryptMessages(messages: MessageTuples, secret: string): Promise<MessageTuples> {
    return new Promise((resolve, reject) => {
      Object.keys(messages).forEach((messageKey: string) => {
        messages[messageKey] = this.decrypt(messages[messageKey], secret);
      });
      resolve(messages);
    });
  }

  /**
   * Decrypt a stingle string
   * 
   * @param message 
   * @param secret 
   * @returns 
   */
  decrypt(message: string, secret: string): string {
    return aes.decrypt(message, secret).toString(enc);
  }

  decryptRuntimeDocument(document: RuntimeDocument, secret: string): Promise<RuntimeDocument> {
    return new Promise((resolve, reject) => {
      if (!document.decrypted) {
        switch (document.type) {
          case 'user-conf': {
            document.name = this.decrypt(document.name, secret);
            document.value = this.decrypt(document.value, secret);
            document.decrypted = true;
            break;
          }
          case 'space-conf': {
            break;
          }
          case 'workspace': {
            document.remoteConfig = this.decrypt(document.remoteConfig, secret);
            document.pwHash = this.decrypt(document.pwHash, secret);
            document.decrypted = true;
            break;
          }
          case 'folder': {
            document.name = this.decrypt(document.name, secret);
            document.decrypted = true;
            break;
          }
          case 'note': {
            document.name = this.decrypt(document.name, secret);
            document.content = this.decrypt(document.content, secret);
            document.decrypted = true;
            break;
          }
          case 'file': {
            document.name = this.decrypt(document.name, secret);
            document.content = this.decrypt(document.content, secret);
            document.decrypted = true;
            break;
          }
          default: {
            console.error("not handled document", document);
          }
        }
      }
      resolve(document);
    });
  }

  toStorageDocument(document: RuntimeDocument, secret: string): Promise<EncryptedDocument> {
    return new Promise((resolve, reject) => {
      switch (document.type) {
        case 'user-conf': {
          const encryptedUserConf: EncryptedUserConf = {
            name: document.name,
            value: document.value,
            type: "user-conf",
            _id: document._id,
            _rev: document._rev
          }
          if (document.decrypted) {
            encryptedUserConf.name = this.encrypt(encryptedUserConf.name, secret);
            encryptedUserConf.value = this.encrypt(encryptedUserConf.value, secret);
          }
          resolve(encryptedUserConf);
          break;
        }
        case 'space-conf': {
          const ecnryptedSpaceConf: EncryptedSpaceConf = {
            name: document.name,
            pwDoubleHash: document.pwDoubleHash,
            pwHint: document.pwHint,
            personal: document.personal,
            type: "space-conf",
            _id: document._id,
            _rev: document._rev
          }
          resolve(ecnryptedSpaceConf);
          break;
        }
        case 'workspace': {
          const encryptedRemoteWorkspace: EncryptedRemoteWorkspace = {
            remoteConfig: document.remoteConfig,
            pwHash: document.pwHash,
            type: "workspace",
            _id: document._id,
            _rev: document._rev
          }
          if (document.decrypted) {
            encryptedRemoteWorkspace.remoteConfig = this.encrypt(encryptedRemoteWorkspace.remoteConfig, secret);
            encryptedRemoteWorkspace.pwHash = this.encrypt(encryptedRemoteWorkspace.pwHash, secret);
          }
          resolve(encryptedRemoteWorkspace);
          break;
        }
        case 'folder': {
          const encryptedFolder: EncryptedFolder = {
            name: document.name,
            parent: document.parent,
            type: "folder",
            _id: document._id,
            _rev: document._rev
          }
          if (document.decrypted) {
            encryptedFolder.name = this.encrypt(encryptedFolder.name, secret);
          }
          resolve(encryptedFolder);
          break;
        }
        case 'note': {
          const encryptedNote: EncryptedNote = {
            name: document.name,
            content: document.content,
            folderId: document.folderId,
            type: "note",
            _id: document._id,
            _rev: document._rev
          }
          if (document.decrypted) {
            encryptedNote.name = this.encrypt(encryptedNote.name, secret);
            encryptedNote.content = this.encrypt(encryptedNote.content, secret);
          }
          resolve(encryptedNote);
          break;
        }
        case 'file': {
          const encryptedFile: EncryptedFile = {
            name: document.name,
            content: document.content,
            folderId: document.folderId,
            type: "file",
            _id: document._id,
            _rev: document._rev
          }
          if (document.decrypted) {
            encryptedFile.name = this.encrypt(encryptedFile.name, secret);
            encryptedFile.content = this.encrypt(encryptedFile.content, secret);
          }
          resolve(encryptedFile);
          break;
        }
        default: {
          reject(["Not hanled document", document])
        }
      }
    });
  }
}
