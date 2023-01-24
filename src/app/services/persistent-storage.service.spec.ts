import { TestBed } from '@angular/core/testing';

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
});
