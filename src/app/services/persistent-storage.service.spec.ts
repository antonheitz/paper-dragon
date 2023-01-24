import { TestBed } from '@angular/core/testing';
import { NewEncryptedUser } from '../interfaces/encrypted-user';

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

  it('Add User', async () => {
    expect(await service.addEncryptedUser({
      name: "Test User",
      pwHint: "This is the Hint",
      workspaces: [],
      theme: "Theme identifier",
      pwDoubbleHash: "Hash the pw another time!"
    } as NewEncryptedUser)).toBe(Promise.resolve({
      name: "Test User",
      pwHint: "This is the Hint",
      workspaces: [],
      theme: "Theme identifier",
      pwDoubbleHash: "Hash the pw another time!"
    }))
  })
});
