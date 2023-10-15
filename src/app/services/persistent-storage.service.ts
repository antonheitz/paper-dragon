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
  async _selectSpace(spaceId: string | undefined): Promise<any> {
    const workspaces = await this.workspaces();
    if (typeof spaceId === 'undefined') {
      return workspaces[PERSONAL_WORKSPACE_NAME];
    }
    if (!Object.keys(workspaces).includes(spaceId)) {
      throw new Error(`Space ${spaceId} not found.`)
    }
    return workspaces[spaceId];
  }

  /**
   * Initialize Pouchdbs for all registered names.
   * 
   * @returns 
   */
  async _loadWorkspaces(): Promise<void> {
    const result = await this.workspaceRegistry.allDocs({
      include_docs: true,
      attachments: true
    });
    this._workspaces = {};
    result.rows.map((row: any) => {
      return row.doc;
    }).forEach((registeredWorkspace: RegisteredWorkspace) => {
      this._workspaces[registeredWorkspace.userWorkspaceId] = this._openDb(registeredWorkspace._id);
    });
  }

  /**
   * get initialized Pouchdbs for all registered names.
   * 
   * @returns object containing opened pouchdbs
   */
  async workspaces(): Promise<{ [workspace_id: string]: any }> {
    if (Object.keys(this._workspaces).includes(PERSONAL_WORKSPACE_NAME)) {
      return this._workspaces;
    }
    await this._loadWorkspaces();
    if (Object.keys(this._workspaces).includes(PERSONAL_WORKSPACE_NAME)) {
      return this._workspaces;
    }
    await this.deleteAllSpaces();
    const spaceId = await this.createSpace(PERSONAL_WORKSPACE_NAME, "Personal Space", "", "");
    return this._workspaces;
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
  async createSpace(spaceId: string, spaceName: string, pwDoubbleHash: string, pwHint: string): Promise<string> {
    const response: DatabaseCondensedResponse = await this.workspaceRegistry.post({ userWorkspaceId: spaceId });
    this._workspaces[spaceId] = this._openDb(response.id);
    await this.initSpace(pwDoubbleHash, pwHint, spaceId, spaceName);
    return spaceId;
  }

  /**
   * Get the count of items in the space for the given spaceId. 
   * 
   * @param spaceId 
   * @returns count of all docs
   */
  async spaceDocumentCount(spaceId?: string): Promise<number> {
    const spaceStorage = await this._selectSpace(spaceId);
    const info = await spaceStorage.info()
    return info.doc_count;
  }

  /**
   * Initialite the given space with a space config.
   * 
   * @param pwDoubleHash 
   * @param pwHint 
   * @param spaceId 
   * @returns 
   */
  async initSpace(pwDoubleHash: string, pwHint: string, spaceId: string, spaceName: string): Promise<void> {
    const spaceConf: EncryptedSpaceConf = {
      _id: "",
      _rev: "",
      name: spaceName,
      pwDoubleHash: pwDoubleHash,
      pwHint: pwHint,
      personal: (spaceId === PERSONAL_WORKSPACE_NAME),
      type: "space-conf"
    }
    const document = await this.createDocument(spaceConf, spaceId);
  }

  /**
   * Load all documents from the given space. 
   * 
   * @param spaceId 
   * @returns all loaded encrypted documents from the space
   */
  async loadSpace(spaceId?: string): Promise<EncryptedDocument[]> {
    const spaceStorage = await this._selectSpace(spaceId);
    const result = await spaceStorage.allDocs({
      include_docs: true,
      attachments: true
    });
    return result.rows.map((row: any) => {
      return row.doc;
    }) as EncryptedDocument[];
  }

  /**
   * Delete the space with the given spaceId.
   * If left blank, this will delete the personal space.
   * 
   * @param spaceId 
   * @returns 
   */
  async deleteSpace(spaceId?: string): Promise<void> {
    const spaceStorage = await this._selectSpace(spaceId);
    const info = await spaceStorage.info();
    const dbName: string = info.db_name;
    await spaceStorage.destroy()
    const result: RegisteredWorkspace = await this.workspaceRegistry.get(dbName);
    await this.workspaceRegistry.remove(result);
    if (typeof spaceId === 'undefined') {
      spaceId = PERSONAL_WORKSPACE_NAME;
    }
    delete this._workspaces[spaceId];
  }

  /**
   * Delete all workspaces , including the personal space.
   * s
   * @returns 
   */
  async deleteAllSpaces(): Promise<void> {
    const knownSpaces: string[] = Object.keys(this._workspaces);
    await Promise.all(knownSpaces.map(async (spaceId: string) => {
      return this.deleteSpace(spaceId);
    }))
    return;
  }

  // Document CUD operations

  /**
   * Adds the document to the space with the given spaceId.
   * 
   * @param document 
   * @param spaceId 
   * @returns The created document with _id and _rev.
   */
  async createDocument(document: EncryptedDocument, spaceId?: string): Promise<EncryptedDocument> {
    const spaceStorage: any = await this._selectSpace(spaceId);
    const createDocument: any = document;
    delete createDocument._id;
    delete createDocument._rev;
    const response: DatabaseCondensedResponse = await spaceStorage.post(createDocument);
    const returnDocument: EncryptedDocument = await spaceStorage.get(response.id);
    return returnDocument
  }

  /**
   * Get all documents for a given type
   * 
   * @param documentType 
   * @param spaceId 
   * @returns 
   */
  async getDocumentByType(documentType: string, spaceId?: string): Promise<EncryptedDocument[]> {
    const documents: EncryptedDocument[] = await this.loadSpace(spaceId);
    return documents.filter((item: EncryptedDocument) => {
      return item.type === documentType;
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
  async updateDocument(document: EncryptedDocument, spaceId?: string): Promise<EncryptedDocument> {
    const spaceStorage: any = await this._selectSpace(spaceId);
    const fetchedDocument: EncryptedDocument = await spaceStorage.get(document._id);
    document._rev = fetchedDocument._rev;
    const response: DatabaseCondensedResponse = await spaceStorage.put(document);
    document._rev = response.rev;
    return document;
  }

  /**
   * Deletes a given document from the space with the given spaceId.
   * This does not require the correct revision and will delete the most recent verison.
   * 
   * @param document 
   * @param spaceId 
   * @returns 
   */
  async deleteDocument(document: EncryptedDocument, spaceId?: string): Promise<void> {
    const spaceStorage: any = await this._selectSpace(spaceId);
    const fetchedDocument: EncryptedDocument = await spaceStorage.get(document._id);
    await spaceStorage.remove(fetchedDocument);
  }
}