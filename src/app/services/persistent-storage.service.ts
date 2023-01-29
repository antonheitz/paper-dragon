import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { EncryptedDocument } from '../interfaces/base-document';
import { EncryptedSpaceConf } from '../interfaces/encrypted/encrypted-space-conf';

interface RegisteredWorkspace {
  _id: string
  _rev: string
  userWorkspaceId: string
}

interface DatabaseAddResponse {
  id: string,
  ok: boolean,
  rev: string
}

export const WORKSPACE_REGISTRY_NAME: string = "local_spaces";
export const PERSONAL_WORKSPACE_NAME: string = "personal_space";

@Injectable({
  providedIn: 'root'
})
export class PersistentStorageService {

  workspaceRegistry: any;
  _workspaces: { [workspace_id: string]: any } = {};

  constructor() {
    this.workspaceRegistry = this._openDb(WORKSPACE_REGISTRY_NAME);
  }

  // base database handling

  _openDb(name: string): any {
    return new PouchDB(name);
  }

  _selectSpace(spaceId: string | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      this.workspaces().then((workspaces: { [workspaceId: string]: any; }) => {
        if (typeof spaceId !== 'undefined') {
          if (Object.keys(workspaces).includes(spaceId)) {
            resolve(workspaces[spaceId]);
          } else {
            reject("Space not found");
          }
        } else {
          resolve(workspaces[PERSONAL_WORKSPACE_NAME]);
        }
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  _loadWorkspaces(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.workspaceRegistry.allDocs({
        include_docs: true,
        attachments: true
      }).then((result: any) => {
        this._workspaces = {};
        result.rows.map((row: any) => {
          return row.doc;
        }).forEach((registeredWorkspace: RegisteredWorkspace) => {
          this._workspaces[registeredWorkspace.userWorkspaceId] = this._openDb(registeredWorkspace._id);
        });
        resolve();
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  workspaces(): Promise<{ [workspace_id: string]: any }> {
    return new Promise((resolve, reject) => {
      if (Object.keys(this._workspaces).includes(PERSONAL_WORKSPACE_NAME)) {
        resolve(this._workspaces);
      } else {
        this._loadWorkspaces().then(() => {
          if (Object.keys(this._workspaces).includes(PERSONAL_WORKSPACE_NAME)) {
            resolve(this._workspaces);
          } else {
            this.deleteAllSpaces().then(() => {
              this.createSpace(PERSONAL_WORKSPACE_NAME, "", "").then((spaceId: string) => {
                resolve(this._workspaces);
              }).catch((err: Error) => {
                reject(err);
              });
            }).catch((err: Error) => {
              reject(err);
            });
          }
        }).catch((err: Error) => {
          reject(err);
        });
      }
    });
  }

  // Spaces CRUD Operations

  createSpace(userWorkspaceId: string, pwDoubbleHash: string, pwHint: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.workspaceRegistry.post({ userWorkspaceId: userWorkspaceId }).then((response: DatabaseAddResponse) => {
        this._workspaces[userWorkspaceId] = this._openDb(response.id);
        this.initSpace(pwDoubbleHash, pwHint, userWorkspaceId).then(() => {
          resolve(userWorkspaceId);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      })
    })
  }

  spaceDocumentCount(spaceId?: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.info().then((info: any) => {
          resolve(info.doc_count);
        })
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  initSpace(pwDoubleHash: string, pwHint: string, spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.createDocument({
        pwDoubleHash: pwDoubleHash,
        pwHint: pwHint,
        personal: (spaceId === PERSONAL_WORKSPACE_NAME)
      } as EncryptedSpaceConf, spaceId).then((document: EncryptedDocument) => {
        resolve()
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  loadSpace(spaceId?: string): Promise<EncryptedDocument[]> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.allDocs({
          include_docs: true,
          attachments: true
        }).then((result: any) => {
          resolve(result.rows.map((row: any) => {
            return row.doc;
          }) as EncryptedDocument[]);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  deleteSpace(spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.info().then((info: any) => {
          const dbName: string = info.db_name;
          spaceStorage.destroy().then(() => {
            this.workspaceRegistry.get(dbName).then((result: RegisteredWorkspace) => {
              this.workspaceRegistry.remove(result).then(() => {
                if (typeof spaceId === 'undefined') {
                  spaceId = PERSONAL_WORKSPACE_NAME;
                } 
                delete this._workspaces[spaceId];
                resolve();
              }).catch((err: Error) => {
                reject(err);
              });
            })
          }).catch((err: Error) => {
            reject(err);
          });
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  deleteAllSpaces(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const knownSpaces: string[] = Object.keys(this._workspaces);
      Promise.all(knownSpaces.map(async (spaceId: string) => {
        return this.deleteSpace(spaceId);
      })).then(() => {
        resolve()
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  // Document CUD operations

  createDocument(document: EncryptedDocument, spaceId?: string): Promise<EncryptedDocument> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.post(document).then((response: DatabaseAddResponse) => {
          spaceStorage.get(response.id).then((returnDocument: EncryptedDocument) => {
            resolve(returnDocument);
          }).catch((err: Error) => {
            reject(err);
          });
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  updateDocument(document: EncryptedDocument, spaceId?: string): Promise<EncryptedDocument> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.get(document._id).then((fetchedDocument: EncryptedDocument) => {
          document._rev = fetchedDocument._rev;
          return spaceStorage.put(document).then(() => {
            resolve(document);
          }).catch((err: Error) => {
            reject(err);
          });
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }

  deleteDocument(document: EncryptedDocument, spaceId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.get(document._id).then((fetchedDocument: EncryptedDocument) => {
          spaceStorage.remove(fetchedDocument).then(() => {
            resolve();
          }).then((err: Error) => {
            reject(err);
          });
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      });
    })
  }
}