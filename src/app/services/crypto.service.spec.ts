import { TestBed } from '@angular/core/testing';
import { EncryptedDocument } from '../model/base-document';
import { RuntimeFile } from '../model/runtime/runtime-file';
import { RuntimeFolder } from '../model/runtime/runtime-folder';
import { RuntimeNote } from '../model/runtime/runtime-note';
import { RuntimeRemoteWorkspace } from '../model/runtime/runtime-remote-workspace';
import { RuntimeUserConf } from '../model/runtime/runtime-user-conf';
import { EncryptedFile } from '../model/storage/encrypted-file';
import { EncryptedFolder } from '../model/storage/encrypted-folder';
import { EncryptedNote } from '../model/storage/encrypted-note';
import { EncryptedRemoteWorkspace } from '../model/storage/encrypted-remote-workspace';
import { EncryptedUserConf } from '../model/storage/encrypted-user-conf';

import { CryptoService, MessageTuples } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Hashing', async () => {
    expect(await service.hashString("Hello there!")).toBe("89b8b8e486421463d7e0f5caf60fb9cb35ce169b76e657ab21fc4d1d6b093603");
  });

  it('Encryption and Decryption', async () => {
    const value: MessageTuples = {
      one: "My secret message",
      anotherOne: "Another secret message",
      thisToo: "Message three",
      empty: ""
    };
    const valueBackup: MessageTuples = JSON.parse(JSON.stringify(value));
    const secret: string = await service.hashString("Super secret");
    const encryptedMessage: MessageTuples = await service.encryptMessages(value, secret);
    const decryptedMessage: MessageTuples = await service.decryptMessages(encryptedMessage, secret);
    expect(decryptedMessage).toEqual(valueBackup);
  });

  it('Document Encryption and Decryption', async () => {
    const secret: string = await service.hashString("very secret string");
    // check strings
    const clearString1: string = "Clear text one";
    const encryptedString1: string = service.encrypt(clearString1, secret);
    const clearString2: string = "Clear text two";
    const encryptedString2: string = service.encrypt(clearString2, secret);
    const clearString3: string = "Clear text three";
    const encryptedString4: string = service.encrypt(clearString3, secret);
    // User conf
    const loadedUserConf: RuntimeUserConf = {
      name: encryptedString1,
      value: encryptedString2,
      type: "user-conf",
      encryptedKeys: ["name", "value"],
      decrypted: false,
      _id: "test-user-id",
      _rev: "test-user-rev"
    }
    await service.decryptRuntimeDocument(loadedUserConf, secret);
    expect(loadedUserConf.name).toBe(clearString1);
    expect(loadedUserConf.value).toBe(clearString2);
    const encryptedUserConf: EncryptedDocument = await service.toStorageDocument(loadedUserConf, secret);
    expect(service.decrypt((encryptedUserConf as EncryptedUserConf).name, secret)).toBe(clearString1);
    expect(service.decrypt((encryptedUserConf as EncryptedUserConf).value, secret)).toBe(clearString2);
    // remote workspace
    const loadedWorkspace: RuntimeRemoteWorkspace = {
      remoteConfig: encryptedString1,
      pwHash: encryptedString2,
      type: "workspace",
      encryptedKeys: ["remoteConfig", "pwHash"],
      decrypted: false,
      _id: "test-workspace-id",
      _rev: "test-workspace-rev"
    }
    await service.decryptRuntimeDocument(loadedWorkspace, secret);
    expect(loadedWorkspace.remoteConfig).toBe(clearString1);
    expect(loadedWorkspace.pwHash).toBe(clearString2);
    const encryptedWorkspace: EncryptedDocument = await service.toStorageDocument(loadedWorkspace, secret);
    expect(service.decrypt((encryptedWorkspace as EncryptedRemoteWorkspace).remoteConfig, secret)).toBe(clearString1);
    expect(service.decrypt((encryptedWorkspace as EncryptedRemoteWorkspace).pwHash, secret)).toBe(clearString2);
    // folder
    const loadedFolder: RuntimeFolder = {
      name: encryptedString1,
      parent: "this-parent-id",
      type: "folder",
      encryptedKeys: ["name"],
      decrypted: false,
      _id: "test-folder-id",
      _rev: "test-folder-rev"
    }
    await service.decryptRuntimeDocument(loadedFolder, secret);
    expect(loadedFolder.name).toBe(clearString1);
    const encryptedFolder: EncryptedDocument = await service.toStorageDocument(loadedFolder, secret);
    expect(service.decrypt((encryptedFolder as EncryptedFolder).name, secret)).toBe(clearString1);
    // Note 
    const loadedNote: RuntimeNote = {
      name: encryptedString1,
      folderId: "parent-folder-id",
      content: encryptedString2,
      type: "note",
      encryptedKeys: ["name", "content"],
      decrypted: false,
      _id: "test-note-id",
      _rev: "test-note-rev"
    }
    await service.decryptRuntimeDocument(loadedNote, secret);
    expect(loadedNote.name).toBe(clearString1);
    expect(loadedNote.content).toBe(clearString2);
    const encryptedNote: EncryptedDocument = await service.toStorageDocument(loadedNote, secret);
    expect(service.decrypt((encryptedNote as EncryptedNote).name, secret)).toBe(clearString1);
    expect(service.decrypt((encryptedNote as EncryptedNote).content, secret)).toBe(clearString2);
    // file
    const loadedFile: RuntimeFile = {
      name: encryptedString1,
      folderId: "parent-folder-id",
      content: encryptedString2,
      type: "file",
      encryptedKeys: ["name", "content"],
      decrypted: false,
      _id: "test-file-id",
      _rev: "test-file-rev"
    }
    await service.decryptRuntimeDocument(loadedFile, secret);
    expect(loadedFile.name).toBe(clearString1);
    expect(loadedFile.content).toBe(clearString2);
    const encryptedFile: EncryptedDocument = await service.toStorageDocument(loadedFile, secret);
    expect(service.decrypt((encryptedFile as EncryptedFile).name, secret)).toBe(clearString1);
    expect(service.decrypt((encryptedFile as EncryptedFile).content, secret)).toBe(clearString2);
  })
});
