import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import { EncryptedDocument } from '../model/base-document';
import { EncryptedSpaceConf } from '../model/storage/encrypted-space-conf';

interface RegisteredWorkspace {
  _id: string
  _rev: string
  userWorkspaceId: string
}

interface DatabaseCondensedResponse {
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

  /**
   * Open the database with the given name
   * 
   * @param name 
   * @returns Pouchdb Object
   */
  _openDb(name: string): any {
    return new PouchDB(name);
  }

  /**
   * Get Pouchdb for the spaceId.
   * 
   * @param spaceId 
   * @returns PouchDB Object
   */
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

  /**
   * Initialize Pouchdbs for all registered names.
   * 
   * @returns 
   */
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

  /**
   * get initialized Pouchdbs for all registered names.
   * 
   * @returns object containing opened pouchdbs
   */
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
              this.createSpace(PERSONAL_WORKSPACE_NAME, "Personal Space", "", "").then((spaceId: string) => {
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

  /**
   * Create a new workspace database with the given parameters.
   * 
   * @param spaceId 
   * @param pwDoubbleHash 
   * @param pwHint 
   * @returns the spaceId created
   */
  createSpace(spaceId: string, spaceName: string, pwDoubbleHash: string, pwHint: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.workspaceRegistry.post({ userWorkspaceId: spaceId }).then((response: DatabaseCondensedResponse) => {
        this._workspaces[spaceId] = this._openDb(response.id);
        this.initSpace(pwDoubbleHash, pwHint, spaceId, spaceName).then(() => {
          resolve(spaceId);
        }).catch((err: Error) => {
          reject(err);
        });
      }).catch((err: Error) => {
        reject(err);
      })
    })
  }

  /**
   * Get the count of items in the space for the given spaceId. 
   * 
   * @param spaceId 
   * @returns count of all docs
   */
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

  /**
   * Initialite the given space with a space config.
   * 
   * @param pwDoubleHash 
   * @param pwHint 
   * @param spaceId 
   * @returns 
   */
  initSpace(pwDoubleHash: string, pwHint: string, spaceId: string, spaceName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const spaceConf: EncryptedSpaceConf = {
        _id: "",
        _rev: "",
        name: spaceName,
        pwDoubleHash: pwDoubleHash,
        pwHint: pwHint,
        personal: (spaceId === PERSONAL_WORKSPACE_NAME),
        type: "space-conf"
      }
      this.createDocument(spaceConf, spaceId).then((document: EncryptedDocument) => {
        resolve()
      }).catch((err: Error) => {
        reject(err);
      });
    });
  }

  /**
   * Load all documents from the given space. 
   * 
   * @param spaceId 
   * @returns all loaded encrypted documents from the space
   */
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

  /**
   * Delete the space with the given spaceId.
   * If left blank, this will delete the personal space.
   * 
   * @param spaceId 
   * @returns 
   */
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

  /**
   * Delete all workspaces , including the personal space.
   * s
   * @returns 
   */
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

  /**
   * Adds the document to the space with the given spaceId.
   * 
   * @param document 
   * @param spaceId 
   * @returns The created document with _id and _rev.
   */
  createDocument(document: EncryptedDocument, spaceId?: string): Promise<EncryptedDocument> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        const createDocument: any = document;
        delete createDocument._id;
        delete createDocument._rev;
        spaceStorage.post(createDocument).then((response: DatabaseCondensedResponse) => {
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

  /**
   * Get all documents for a given type
   * 
   * @param documentType 
   * @param spaceId 
   * @returns 
   */
  getDocumentByType(documentType: string, spaceId?: string): Promise<EncryptedDocument[]> {
    return new Promise((resolve, reject) => {
      this.loadSpace(spaceId).then((documents: EncryptedDocument[]) => {
        resolve(documents.filter((item: EncryptedDocument) => {
          return item.type === documentType;
        }))
      }).catch((err: Error) => {
        reject(err);
      })
    });
  }

  /**
   * Updates the stored document to match the given document in the given spaceId.
   * This does not require a new revision, since the newest version will be updated to match the new document.
   * 
   * @param document 
   * @param spaceId 
   * @returns The updated document with new _rev.
   */
  updateDocument(document: EncryptedDocument, spaceId?: string): Promise<EncryptedDocument> {
    return new Promise((resolve, reject) => {
      this._selectSpace(spaceId).then((spaceStorage: any) => {
        spaceStorage.get(document._id).then((fetchedDocument: EncryptedDocument) => {
          document._rev = fetchedDocument._rev;
          spaceStorage.put(document).then((response: DatabaseCondensedResponse) => {
            document._rev = response.rev;
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

  /**
   * Deletes a given document from the space with the given spaceId.
   * This does not require the correct revision and will delete the most recent verison.
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
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