import { Injectable, resolveForwardRef } from '@angular/core';
import { EncryptedDocument } from '../model/base-document';
import { RuntimeDocument } from '../model/runtime-document';
import { RuntimeFile } from '../model/runtime/runtime-file';
import { RuntimeNote } from '../model/runtime/runtime-note';
import { RuntimeEntry } from '../model/runtime/runtime-entry';
import { RuntimeRemoteWorkspace } from '../model/runtime/runtime-remote-workspace';
import { RuntimeSpaceConf } from '../model/runtime/runtime-space-conf';
import { RuntimeUserConf } from '../model/runtime/runtime-user-conf';
import { CryptoService } from './crypto.service';
import { PersistentStorageService, PERSONAL_WORKSPACE_NAME } from './persistent-storage.service';
import { Space } from '../model/space';

@Injectable({
  providedIn: 'root'
})
export class RuntimeStorageService {

  spaces: { [spaceId: string]: Space } = {}

  constructor(private cryptoService: CryptoService, private persistentStorageService: PersistentStorageService) { }

  /**
   * get the spaceID for the given spaceId to compensate for undefined
   * 
   * @param spaceId 
   * @returns 
   */
  _getSpaceId(spaceId?: string): string {
    if (typeof spaceId !== 'undefined') {
      return spaceId;
    } else {
      return PERSONAL_WORKSPACE_NAME
    }
  }

  /**
   * Initialize with loading the personal space
   * 
   * @returns 
   */
  async init(): Promise<void> {
    await this.loadSpace();
  }

  /**
   * Return a list of spaceConfs loaded
   * 
   * @returns 
   */
  getSpaceConfs(): RuntimeSpaceConf[] {
    return Object.keys(this.spaces).map(item => this.spaces[item].spaceConf).sort((a: RuntimeSpaceConf, b: RuntimeSpaceConf) => {
      if (a.personal) {
        return -1;
      } else if (b.personal) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Create Space and load it
   * 
   * @param name 
   * @returns 
   */
  async createSpace(name: string): Promise<string> {
    const newSpaceConf: RuntimeRemoteWorkspace = {
      remoteConfig: "",
      pwHash: "",
      type: "workspace",
      encryptedKeys: ["remoteConfig", "pwHash"],
      decrypted: true,
      _id: "not loaded",
      _rev: "not loaded"
    }
    const createdSpace: RuntimeDocument = await this.createDocument(newSpaceConf);
    const createdSpaceId: string = await this.persistentStorageService.createSpace(createdSpace._id, name, "", "");
    await this.loadSpace(createdSpaceId);
    return createdSpaceId;
  }

  /**
   * Load the space for the given space id
   * 
   * @param spaceId 
   * @returns 
   */
  async loadSpace(spaceId?: string): Promise<void> {
    const documents: EncryptedDocument[] = await this.persistentStorageService.loadSpace(spaceId);
    const newSpace: Space = {
      userConf: [],
      spaceConf: {
        name: "not loaded",
        pwHint: "not loaded",
        pwHash: "not loaded",
        pwDoubleHash: "not loaded",
        personal: false,
        type: "space-conf",
        encryptedKeys: [],
        decrypted: false,
        _id: "not loaded",
        _rev: "not loaded"
      },
      remoteSpaces: [],
      notes: [],
      entries: [],
      files: []
    };
    documents.forEach((document: EncryptedDocument) => {
      switch (document.type) {
        case 'user-conf': {
          const loadedUserConf: RuntimeUserConf = {
            name: document.name,
            value: document.value,
            type: document.type,
            encryptedKeys: ["name", "value"],
            decrypted: false,
            _id: document._id,
            _rev: document._rev
          }
          newSpace.userConf.push(loadedUserConf);
          break;
        }
        case 'space-conf': {
          newSpace.spaceConf = {
            name: document.name,
            pwHint: document.pwHint,
            pwHash: "",
            pwDoubleHash: document.pwDoubleHash,
            personal: document.personal,
            type: document.type,
            encryptedKeys: [],
            decrypted: false,
            _id: document._id,
            _rev: document._rev
          };
          break;
        }
        case 'workspace': {
          const loadedWorkspace: RuntimeRemoteWorkspace = {
            remoteConfig: document.remoteConfig,
            pwHash: document.pwHash,
            type: document.type,
            encryptedKeys: ["remoteConfig", "pwHash"],
            decrypted: false,
            _id: document._id,
            _rev: document._rev
          }
          newSpace.remoteSpaces.push(loadedWorkspace);
          break;
        }
        case 'note': {
          const loadedNote: RuntimeNote = {
            name: document.name,
            type: document.type,
            encryptedKeys: ["name"],
            decrypted: false,
            _id: document._id,
            _rev: document._rev
          }
          newSpace.notes.push(loadedNote);
          break;
        }
        case 'entry': {
          const loadedEntry: RuntimeEntry = {
            title: document.title,
            noteId: document.noteId,
            content: document.content,
            type: document.type,
            encryptedKeys: ["title", "content"],
            decrypted: false,
            _id: document._id,
            _rev: document._rev
          }
          newSpace.entries.push(loadedEntry);
          break;
        }
        case 'file': {
          const loadedFile: RuntimeFile = {
            name: document.name,
            entryId: document.entryId,
            content: document.content,
            type: document.type,
            encryptedKeys: ["name", "content"],
            decrypted: false,
            _id: document._id,
            _rev: document._rev
          }
          newSpace.files.push(loadedFile);
          break;
        }
        default: {
          console.error("not handled document", document);
        }
      }
    });
    this.spaces[this._getSpaceId(spaceId)] = newSpace;
  }

  /**
   * Delete the space with the given spaceId.
   * 
   * @param spaceId 
   * @returns 
   */
  async deleteSpace(spaceId?: string): Promise<void> {
    delete this.spaces[this._getSpaceId(spaceId)];
    await this.persistentStorageService.deleteSpace(spaceId);
  }

  /**
   * Decrypt the space with the given spaceId and secret.
   * 
   * @param secret 
   * @param spaceId 
   * @returns 
   */
  async decryptSpace(secret: string, spaceId?: string): Promise<void> {
    // check if the hash equals the space dhash
    const secretHash: string = await this.cryptoService.hashString(secret);
    const selectedSpace: Space = this.spaces[this._getSpaceId(spaceId)];
    if (selectedSpace.spaceConf.pwDoubleHash !== secretHash) {
      throw new Error("The Password was not correct!")
    }
    selectedSpace.spaceConf.pwHash = secretHash;

    // decrypt all the files in the current space
    selectedSpace.spaceConf.decrypted = true;
    selectedSpace.userConf.forEach(async (userConf: RuntimeUserConf) => {
      await this.cryptoService.decryptRuntimeDocument(userConf, secret);
    });
    selectedSpace.remoteSpaces.forEach(async (remoteSpace: RuntimeRemoteWorkspace) => {
      await this.cryptoService.decryptRuntimeDocument(remoteSpace, secret);
      await this.loadSpace(remoteSpace._id);
      await this.decryptSpace(remoteSpace.pwHash, remoteSpace._id);
    });
    selectedSpace.notes.forEach(async (note: RuntimeNote) => {
      await this.cryptoService.decryptRuntimeDocument(note, secret);
    });
    selectedSpace.entries.forEach(async (entry: RuntimeEntry) => {
      await this.cryptoService.decryptRuntimeDocument(entry, secret);
    });
    selectedSpace.files.forEach(async (file: RuntimeFile) => {
      await this.cryptoService.decryptRuntimeDocument(file, secret);
    });
  }

  /**
   * Get the hash of a string
   * 
   * @param raw 
   * @returns 
   */
  async hashString(raw: string): Promise<string> {
    return this.cryptoService.hashString(raw);
  }

  /**
   * Get the current space
   * 
   * @param spaceId 
   * @returns 
   */
  space(spaceId?: string): Space {
    return this.spaces[this._getSpaceId(spaceId)];
  }

  /**
   * Create a new document
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
  async createDocument(document: RuntimeDocument, spaceId?: string): Promise<RuntimeDocument> {
    const usedSpace: Space = this.space(spaceId);
    switch (document.type) {
      case "user-conf": {
        usedSpace.userConf.push(document);
        break;
      }
      case "workspace": {
        usedSpace.remoteSpaces.push(document);
        break;
      }
      case "note": {
        usedSpace.notes.push(document);
        break;
      }
      case "entry": {
        usedSpace.entries.push(document);
        break;
      }
      case "file": {
        usedSpace.files.push(document);
        break;
      }
      default: {
        throw new Error(`Unhandled document type ${document.type}`);
      }
    }
    const newDoc: EncryptedDocument = await this.cryptoService.toStorageDocument(document, usedSpace.spaceConf.pwHash);
    const addedDoc: EncryptedDocument = await this.persistentStorageService.createDocument(newDoc, spaceId);
    document._id = addedDoc._id;
    document._rev = addedDoc._rev;
    return document;
  }

  /**
   * save the updated document
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
  async updateDocument(document: RuntimeDocument, spaceId?: string): Promise<RuntimeDocument> {
    const usedSpace: Space = this.space(spaceId);
    const storageDoc: EncryptedDocument = await this.cryptoService.toStorageDocument(document, usedSpace.spaceConf.pwHash);
    const updateDocument: EncryptedDocument = await this.persistentStorageService.updateDocument(storageDoc, spaceId);
    document._rev = updateDocument._rev;
    return document
  }

  /**
   * delete the given document
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
  async deleteDocument(document: RuntimeDocument, spaceId?: string): Promise<void> {
    const usedSpace: Space = this.space(spaceId);
    switch (document.type) {
      case "user-conf": {
        usedSpace.userConf = usedSpace.userConf.filter((userConfDoc: RuntimeUserConf) => {
          return document._id !== userConfDoc._id;
        });
        break;
      }
      case "workspace": {
        usedSpace.remoteSpaces = usedSpace.remoteSpaces.filter((remoteSpaceDoc: RuntimeRemoteWorkspace) => {
          return document._id !== remoteSpaceDoc._id;
        });
        break;
      }
      case "note": {
        usedSpace.notes = usedSpace.notes.filter((noteDoc: RuntimeNote) => {
          return document._id !== noteDoc._id;
        });
        break;
      }
      case "entry": {
        usedSpace.entries = usedSpace.entries.filter((entryDoc: RuntimeEntry) => {
          return document._id !== entryDoc._id;
        });
        break;
      }
      case "file": {
        usedSpace.files = usedSpace.files.filter((fileDoc: RuntimeFile) => {
          return document._id !== fileDoc._id;
        });
        break;
      }
      default: {
        throw new Error(`Unhandled document type ${document.type}`);
      }
    }
    // delete from persistent storage
    await this.persistentStorageService.deleteDocument(document, spaceId);
  }
}
