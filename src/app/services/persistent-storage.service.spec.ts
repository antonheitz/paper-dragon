import { TestBed } from '@angular/core/testing';
import { EncryptedUser, NewEncryptedUser } from '../interfaces/encrypted-user';

import { PersistentStorageService } from './persistent-storage.service';

describe('PersistentStorageService', () => {
  let service: PersistentStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistentStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('User Crud Operations', async () => {
    const input: NewEncryptedUser = {
      name: "Test User",
      pwHint: "This is the Hint",
      workspaces: [],
      theme: "Theme identifier",
      pwDoubbleHash: "Hash the pw another time!"
    };
    const encryptedUser: EncryptedUser = await service.createUser(input);
    const loadedUsers: EncryptedUser[] = await service.loadUsers();
    expect(loadedUsers).toEqual([encryptedUser]);
    encryptedUser.pwHint = "This is the new Hint!";
    const editedUserId: string = await service.updateUser(encryptedUser);
    expect(editedUserId).toBe(encryptedUser._id);
    const loadedEditedUsers: EncryptedUser[] = await service.loadUsers();    
    await service.deleteUser(loadedEditedUsers[0]);
    const loadedDeleteddUsers: EncryptedUser[] = await service.loadUsers();    
    expect(loadedDeleteddUsers.length).toBe(0);
  });
});
