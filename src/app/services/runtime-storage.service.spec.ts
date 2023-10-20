import { TestBed } from '@angular/core/testing';
import { RuntimeDocument } from '../model/runtime-document';
import { RuntimeEntry } from '../model/runtime/runtime-entry';
import { RuntimeStorageService } from './runtime-storage.service';
import { Space } from '../model/space';

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
    expect(service.space().entries.length).toBe(0);
    const loadedEntry: RuntimeEntry = {
      title: "New Entry",
      noteId: "parent-note-id",
      content: "",
      type: "entry",
      order: 1,
      encryptedKeys: ["title", "content"],
      decrypted: true,
      _id: "newly-added",
      _rev: "newly-added"
    }
    const addedDocument: RuntimeDocument = await service.createDocument(loadedEntry);
    expect(service.space().entries.length).toBe(1);
    // edit and save document
    loadedEntry.content = "Hello there, General Kenobi!";
    await service.updateDocument(loadedEntry);
    expect(service.space().entries.length).toBe(1);
    // delete document
    await service.deleteDocument(loadedEntry);
    expect(service.space().entries.length).toBe(0);
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
