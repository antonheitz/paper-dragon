import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { DatabaseAddResponse } from '../interfaces/database-add-response';
import { EncryptedUser, NewEncryptedUser } from '../interfaces/encrypted-user';

@Injectable({
  providedIn: 'root'
})
export class PersistentStorageService {

  USERS_DB_NAME: string = "users"
  
  usersDB: any;

  constructor() { 
    this.usersDB = new PouchDB(this.USERS_DB_NAME);
  }

  // User CRUD Operations

  createUser(newEncryptedUser: NewEncryptedUser): Promise<EncryptedUser> {
    return new Promise((resolve, reject) => {
      this.usersDB.post(newEncryptedUser).then((response: DatabaseAddResponse) => {
        this.usersDB.get(response.id).then((encryptedUser: EncryptedUser) => {
          resolve(encryptedUser);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }

  loadUsers(): Promise<EncryptedUser[]> {
    return new Promise((resolve, reject) => {
      this.usersDB.allDocs({
        include_docs: true,
        attachments: true
      }).then((result: any) => {
        resolve(result.rows.map((row: any) => {
          return row.doc;
        }) as EncryptedUser[]);
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }
  
  updateUser(updatedUser: EncryptedUser): Promise<string> {
    return new Promise((resolve, reject) => {
      this.usersDB.get(updatedUser._id).then((fetchedUser: EncryptedUser) => {
        updatedUser._rev = fetchedUser._rev;
        return this.usersDB.put(updatedUser).then(() => {
          resolve(updatedUser._id);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }

  deleteUser(encryptedUser: EncryptedUser): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usersDB.remove(encryptedUser).then(() => {
        resolve();
      }).then((err: Error) => {
        reject(err);
      });
    })
  }
}
