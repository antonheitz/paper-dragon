import { Injectable } from '@angular/core';
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

interface Space {
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

  _getSpaceId(spaceId?: string): string {
    if (typeof spaceId !== 'undefined') {
      return spaceId;
    } else {
      return PERSONAL_WORKSPACE_NAME
    }
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.loadSpace().then(() => {
        resolve();
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }

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

  decryptSpace(secret: string, spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // check if the hash equals the space dhash
      this.cryptoService.hashString(secret).then(async (pwHash: string) => {
        const selectedSpace: Space = this.spaces[this._getSpaceId(spaceId)];
        if (selectedSpace.spaceConf.pwDoubleHash !== await this.cryptoService.hashString(pwHash)) {
          reject("The Password was not correct!")
        } else {
          selectedSpace.spaceConf.pwHash = pwHash;
          try {
            // decrypt all the files in the current space
            selectedSpace.spaceConf.decrypted = true;
            selectedSpace.userConf.forEach(async (userConf: RuntimeUserConf) => {
              await this.cryptoService.decryptRuntimeDocument(userConf, secret);
            });
            selectedSpace.remoteSpaces.forEach(async (remoteSpace: RuntimeRemoteWorkspace) => {
              await this.cryptoService.decryptRuntimeDocument(remoteSpace, secret);
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

  saveDocument(document: RuntimeDocument, secret: string, spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cryptoService.toStorageDocument(document, secret).then((storageDocument: EncryptedDocument) => {
        this.persistentStorageService.updateDocument(storageDocument).then((updated: EncryptedDocument) => {
          document._rev = updated._rev;
          resolve();
        })
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }
}
