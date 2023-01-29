import { Injectable } from '@angular/core';
import { NewUser, User } from '../interfaces/decrypted/user';
import { EncryptedUser } from '../interfaces/encrypted/encrypted-user';
import { CryptoService } from './crypto.service';
import { PersistentStorageService } from './persistent-storage.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() { }

  // Users 

  encryptedUsers: EncryptedUser[] = [];

  loadEncryptedUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      
    });
  } 
}
