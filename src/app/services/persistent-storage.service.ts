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
    this.usersDB.info().then(function (info: any) {
      console.log(info)
    })
    this.addEncryptedUser({
      name: "Test User",
      pwHint: "This is the Hint",
      workspaces: [],
      theme: "Theme identifier",
      pwDoubbleHash: "Hash the pw another time!"
    }).then((result: EncryptedUser) => {
      console.log(result)
    })
  }

  addEncryptedUser(newEncryptedUser: NewEncryptedUser): Promise<EncryptedUser> {
    return new Promise((resolve, reject) => {
      this.usersDB.post(newEncryptedUser).then((response: DatabaseAddResponse) => {
        resolve({
          _id: response.id,
          _rev: response.rev,
          name: newEncryptedUser.name,
          pwHint: newEncryptedUser.pwHint,
          workspaces: newEncryptedUser.workspaces,
          theme: newEncryptedUser.theme,
          pwDoubbleHash: newEncryptedUser.pwDoubbleHash
        } as EncryptedUser)
      }).catch(function (err: Error) {
        reject(err)
      });
    })
  }
}
