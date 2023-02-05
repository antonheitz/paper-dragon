import { Injectable, resolveForwardRef } from '@angular/core';
import { EncryptedDocument } from '../model/base-document';
import { RuntimeDocument } from '../model/runtime-document';
import { RuntimeFile } from '../model/runtime/runtime-file';
import { RuntimeFolder } from '../model/runtime/runtime-folder';
import { RuntimeNote } from '../model/runtime/runtime-note';
import { RuntimeRemoteWorkspace } from '../model/runtime/runtime-remote-workspace';
import { RuntimeSpaceConf } from '../model/runtime/runtime-space-conf';
import { RuntimeUserConf } from '../model/runtime/runtime-user-conf';
import { CryptoService } from './crypto.service';
import { PersistentStorageService, PERSONAL_WORKSPACE_NAME } from './persistent-storage.service';

export interface Space {
  userConf: RuntimeUserConf[],
  spaceConf: RuntimeSpaceConf,
  remoteSpaces: RuntimeRemoteWorkspace[],
  folder: RuntimeFolder[],
  notes: RuntimeNote[],
  files: RuntimeFile[]
}


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
  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadSpace().then(() => {
        resolve();
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }

  /**
   * Create Space and load it
   * 
   * @param name 
   * @returns 
   */
  createSpace(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const newSpaceConf: RuntimeRemoteWorkspace = {
        remoteConfig: "",
        pwHash: "",
        type: "workspace",
        encryptedKeys: ["remoteConfig", "pwHash"],
        decrypted: true,
        _id: "not loaded",
        _rev: "not loaded"
      }
      this.createDocument(newSpaceConf).then((createdSpace: RuntimeDocument) => {
        this.persistentStorageService.createSpace(createdSpace._id, name, "", "").then((createdSpaceId: string) => {
          this.loadSpace(createdSpaceId).then(() => {
            resolve(createdSpaceId);
          })
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  /**
   * Load the space for the given space id
   * 
   * @param spaceId 
   * @returns 
   */
  loadSpace(spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.persistentStorageService.loadSpace(spaceId).then((documents: EncryptedDocument[]) => {
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
          folder: [],
          notes: [],
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
            case 'folder': {
              const loadedFolder: RuntimeFolder = {
                name: document.name,
                parent: document.parent,
                type: document.type,
                encryptedKeys: ["name"],
                decrypted: false,
                _id: document._id,
                _rev: document._rev
              }
              newSpace.folder.push(loadedFolder);
              break;
            }
            case 'note': {
              const loadedNote: RuntimeNote = {
                name: document.name,
                folderId: document.folderId,
                content: document.content,
                type: document.type,
                encryptedKeys: ["name", "content"],
                decrypted: false,
                _id: document._id,
                _rev: document._rev
              }
              newSpace.notes.push(loadedNote);
              break;
            }
            case 'file': {
              const loadedFile: RuntimeFile = {
                name: document.name,
                folderId: document.folderId,
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
        resolve();
      }).catch((err: Error) => {
        reject(err);
      })
    });
  }

  /**
   * Delete the space with the given spaceId.
   * 
   * @param spaceId 
   * @returns 
   */
  deleteSpace(spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      delete this.spaces[this._getSpaceId(spaceId)];
      this.persistentStorageService.deleteSpace(spaceId).then(() => {
        resolve();
      }).catch((err: Error) => {
        reject(err);
      })
    })
  }

  /**
   * Decrypt the space with the given spaceId and secret.
   * 
   * @param secret 
   * @param spaceId 
   * @returns 
   */
  decryptSpace(secret: string, spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // check if the hash equals the space dhash
      this.cryptoService.hashString(secret).then(async (secretHash: string) => {
        const selectedSpace: Space = this.spaces[this._getSpaceId(spaceId)];
        if (selectedSpace.spaceConf.pwDoubleHash !== secretHash) {
          reject("The Password was not correct!")
        } else {
          selectedSpace.spaceConf.pwHash = secretHash;
          try {
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
            selectedSpace.folder.forEach(async (folder: RuntimeFolder) => {
              await this.cryptoService.decryptRuntimeDocument(folder, secret);
            });
            selectedSpace.notes.forEach(async (note: RuntimeNote) => {
              await this.cryptoService.decryptRuntimeDocument(note, secret);
            });
            selectedSpace.files.forEach(async (file: RuntimeFile) => {
              await this.cryptoService.decryptRuntimeDocument(file, secret);
            });
            resolve()
          } catch(e) {
            // error decrypting files
            reject(e)
          }
        }
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  /**
   * Get the hash of a string
   * 
   * @param raw 
   * @returns 
   */
  hashString(raw: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cryptoService.hashString(raw).then((result: string) => {
        resolve(result);
      }).catch((err: Error) => {
        reject(err);
      });
    })
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
  createDocument(document: RuntimeDocument, spaceId?: string): Promise<RuntimeDocument> {
    return new Promise((resolve, reject) => {
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
        case "folder": {
          usedSpace.folder.push(document);
          break;
        }
        case "note": {
          usedSpace.notes.push(document);
          break;
        }
        case "file": {
          usedSpace.files.push(document);
          break;
        }
        default: {
          console.error("Unhandled note type", document.type);
        }
      }
      this.cryptoService.toStorageDocument(document, usedSpace.spaceConf.pwHash).then((newDoc: EncryptedDocument) => {
        this.persistentStorageService.createDocument(newDoc, spaceId).then((addedDoc: EncryptedDocument) => {
          document._id = addedDoc._id;
          document._rev = addedDoc._rev;
          resolve(document);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  /**
   * save the updated document
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
  updateDocument(document: RuntimeDocument, spaceId?: string): Promise<RuntimeDocument> {
    return new Promise((resolve, reject) => {
      const usedSpace: Space = this.space(spaceId);
      this.cryptoService.toStorageDocument(document, usedSpace.spaceConf.pwHash).then((storageDoc: EncryptedDocument) => {
        this.persistentStorageService.updateDocument(storageDoc, spaceId).then((updateDocument: EncryptedDocument) => {
          document._rev = updateDocument._rev;
          resolve(document);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  /**
   * delete the given document
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
  deleteDocument(document: RuntimeDocument, spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
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
        case "folder": {
          usedSpace.folder = usedSpace.folder.filter((folderDoc: RuntimeFolder) => {
            return document._id !== folderDoc._id;
          });
          break;
        }
        case "note": {
          usedSpace.notes = usedSpace.notes.filter((noteDoc: RuntimeNote) => {
            return document._id !== noteDoc._id;
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
          console.error("Unhandled note type", document.type);
        }
      }
      // delete from persistent storage
      this.persistentStorageService.deleteDocument(document, spaceId).then(() => {
        resolve();
      }).catch((err: Error) => {
        reject(err);
      })
    });
  }
}
