import { TestBed } from '@angular/core/testing';

import { RuntimeStorageService } from './runtime-storage.service';

describe('RuntimeStorageService', () => {
  let service: RuntimeStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuntimeStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', async () => {
    const load = await service.init();
    console.log(load)
  });
});
