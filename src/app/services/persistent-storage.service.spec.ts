import { TestBed } from '@angular/core/testing';
import { EncryptedDocument } from '../model/base-document';
import { EncryptedEntry } from '../model/storage/encrypted-entry';
import { PersistentStorageService, PERSONAL_WORKSPACE_NAME } from './persistent-storage.service';

describe('PersistentStorageService', () => {
  let service: PersistentStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
    const newDocument: EncryptedEntry = {
      _id: "this will be replaced",
      _rev: "this too",
      title: "test entry",
      order: 1,
      noteId: "the note to add it to",
      content: "Hello there! General Kenobi",
      type: "entry"
    };
    const addedDocument: EncryptedEntry = (await service.createDocument(newDocument, spaceName)) as EncryptedEntry;
    // update document
    addedDocument.title = "New Title of the Entry";
    const updatedDocument: EncryptedEntry = (await service.updateDocument(addedDocument, spaceName)) as EncryptedEntry;
    // load documents and check document
    const spaceDocuments: EncryptedDocument[] = await service.loadSpace(spaceName);
    const extractedEntry: EncryptedEntry = spaceDocuments.filter(item => item.type === "entry")[0] as EncryptedEntry;
    expect(extractedEntry.title).toBe(addedDocument.title);
    // delete documents
    await service.deleteDocument(addedDocument, spaceName);
    // delete all workspaces
    await service.deleteAllSpaces();
  });
});
