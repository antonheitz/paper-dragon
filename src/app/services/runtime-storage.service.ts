import { Injectable } from '@angular/core';
import { EncryptedDocument } from '../model/base-document';
import { RuntimeDocument } from '../model/runtime-document';
import { RuntimeFile } from '../model/runtime/runtime-file';
import { RuntimeFolder } from '../model/runtime/runtime-folder';
import { RuntimeNote } from '../model/runtime/runtime-note';
import { RuntimeRemoteWorkspace } from '../model/runtime/runtime-remote-workspace';
import { RuntimeSpaceConf } from '../model/runtime/runtime-space-conf';
import { RuntimeUserConf } from '../model/runtime/runtime-user-conf';
import { EncryptedSpaceConf } from '../model/storage/encrypted-space-conf';
import { EncryptedUserConf } from '../model/storage/encrypted-user-conf';
import { CryptoService } from './crypto.service';
import { PersistentStorageService, PERSONAL_WORKSPACE_NAME } from './persistent-storage.service';

interface Spaces {
  [spaceId: string]: Space
}

interface Space {
  userConf: RuntimeUserConf[],
  spaceConf: RuntimeSpaceConf[],
  remoteSpaces: RuntimeRemoteWorkspace[],
  folder: RuntimeFolder[],
  notes: RuntimeNote[],
  files: RuntimeFile[]
}


@Injectable({
  providedIn: 'root'
})
export class RuntimeStorageService {

  spaces: Spaces = {}

  constructor(private cryptoService: CryptoService, private persistentStorageService: PersistentStorageService) { }

  _getSpaceId(spaceId?: string): string {
    if (typeof spaceId !== 'undefined') {
      return spaceId;
    } else {
      return PERSONAL_WORKSPACE_NAME
    }
  }

  init(): Promise<RuntimeSpaceConf> {
    return new Promise((resolve, reject) => {
      this.loadSpace().then((spaceConf: RuntimeSpaceConf) => {
        resolve(spaceConf);
      }).catch((err: Error) => {
        reject(err);
      })
    })
  }

  loadSpace(spaceId?: string): Promise<RuntimeSpaceConf> {
    return new Promise((resolve, reject) => {
      const newSpace: Space = {
        userConf: [],
        spaceConf: [],
        remoteSpaces: [],
        folder: [],
        notes: [],
        files: []
      }
      this.persistentStorageService.loadSpace(spaceId).then((encryptedDocuments: EncryptedDocument[]) => {
        Promise.all(encryptedDocuments.map((document: EncryptedDocument) => {
          return this._transformToRuntimeDocument(document);
        })).then((result: RuntimeDocument[]) => {
          result.forEach((runtimeDocument: RuntimeDocument) => {
            switch (runtimeDocument.type) {
              case "user-conf": {
                newSpace.userConf.push(runtimeDocument);
              }
              case "space-conf": {
                newSpace.spaceConf.push(runtimeDocument);
              }
            }
          });
          resolve(newSpace.spaceConf[0]);
        }).catch((err: Error) => {
          reject(err);
        })
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  _transformToRuntimeDocument(document: EncryptedDocument): Promise<RuntimeDocument> {
    return new Promise((resolve, reject) => {
      // transform to runtime object
      switch (document.type) {
        case "user-conf": {
          const userConf: RuntimeUserConf = {
            name: (document as EncryptedUserConf).name,
            value: (document as EncryptedUserConf).value,
            type: "user-conf",
            decrypted: false,
            _id: (document as EncryptedUserConf)._id,
            _rev: (document as EncryptedUserConf)._rev
          };
          resolve(userConf);
          break;
        }
        case "space-conf": {
          const encryptedSpaceConf: EncryptedSpaceConf = document;
          const spaceConf: RuntimeSpaceConf = {
            pwHash: "",
            type: "space-conf",
            decrypted: true,
            name: (document as EncryptedSpaceConf).name,
            pwDoubleHash: (document as EncryptedSpaceConf).pwDoubleHash,
            pwHint: (document as EncryptedSpaceConf).pwHint,
            personal: false,
            _id: (document as EncryptedSpaceConf)._id,
            _rev: (document as EncryptedSpaceConf)._rev
          };
          resolve(spaceConf);
          break;
        }
        default: {
          reject("unknown documet type")
        }
      }
    });
  }
}
