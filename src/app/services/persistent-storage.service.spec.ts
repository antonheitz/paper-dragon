import { TestBed } from '@angular/core/testing';
import { EncryptedDocument } from '../model/base-document';
import { EncryptedNote } from '../model/storage/encrypted-note';
import { PersistentStorageService, PERSONAL_WORKSPACE_NAME } from './persistent-storage.service';

describe('PersistentStorageService', () => {
  let service: PersistentStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(PersistentStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Workspace Operations', async () => { 
    // check if personal database got created
    await service.spaceDocumentCount();
    // create a new workspace
    const spaceName: string = "base_test_space";
    await service.createSpace(spaceName, "Test Space", "", "");
    // create a document
    const newDocument: EncryptedNote = {
      _id: "this will be replaced",
      _rev: "this too",
      name: "test note",
      folderId: "the folder to add it to",
      content: "Hello there! General Kenobi",
      type: "note"
    };
    const addedDocument: EncryptedNote = (await service.createDocument(newDocument, spaceName)) as EncryptedNote;
    // update document
    addedDocument.name = "New Name of the Note";
    const updatedDocument: EncryptedNote = (await service.updateDocument(addedDocument, spaceName)) as EncryptedNote;
    // load documents and check document
    const spaceDocuments: EncryptedDocument[] = await service.loadSpace(spaceName);
    const extractedNote: EncryptedNote = spaceDocuments.filter(item => item.type === "note")[0] as EncryptedNote;
    expect(extractedNote.name).toBe(addedDocument.name);
    // delete documents
    await service.deleteDocument(addedDocument, spaceName);
    // delete all workspaces
    await service.deleteAllSpaces();
  });
});
