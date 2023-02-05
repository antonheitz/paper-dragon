import { TestBed } from '@angular/core/testing';
import { RuntimeDocument } from '../model/runtime-document';
import { RuntimeNote } from '../model/runtime/runtime-note';
import { RuntimeStorageService, Space } from './runtime-storage.service';

describe('RuntimeStorageService', () => {
  let service: RuntimeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuntimeStorageService);
  });

  it('should be created', async () => {
    expect(service).toBeTruthy();
  });

  it('Interact with spaces', async () => {
    await service.init();
    const pwHash: string = await service.hashString("top sigrid");
    const personalSpace: Space = service.space();
    // set space data
    personalSpace.spaceConf.pwDoubleHash = await service.hashString(pwHash);
    personalSpace.spaceConf.pwHint = "Sigrid the master of all secrets!";
    service.updateDocument(personalSpace.spaceConf);
    // decrypt
    await service.decryptSpace(pwHash);
    expect(service.space().notes.length).toBe(0);
    const loadedNote: RuntimeNote = {
      name: "New Note",
      folderId: "parent-folder-id",
      content: "",
      type: "note",
      encryptedKeys: ["name", "content"],
      decrypted: true,
      _id: "newly-added",
      _rev: "newly-added"
    }
    const addedDocument: RuntimeDocument = await service.createDocument(loadedNote);
    expect(service.space().notes.length).toBe(1);
    // edit and save document
    loadedNote.content = "Hello there, General Kenobi!";
    await service.updateDocument(loadedNote);
    expect(service.space().notes.length).toBe(1);
    // delete document
    await service.deleteDocument(loadedNote);
    expect(service.space().notes.length).toBe(0);
    // test space actions
    const newSpaceName: string = "Test space";
    const newSpaceId: string = await service.createSpace(newSpaceName);
    expect(service.space(newSpaceId).spaceConf.name).toEqual(newSpaceName);
    expect(service.space().remoteSpaces[0]._id).toBe(newSpaceId);
    // delete space
    await service.deleteSpace(newSpaceId)
    expect(Object.keys(service.spaces).length).toBe(1);
  })
});
