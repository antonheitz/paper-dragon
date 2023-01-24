import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';

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
  }
}
