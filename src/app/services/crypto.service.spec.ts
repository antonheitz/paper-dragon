import { TestBed } from '@angular/core/testing';

import { CryptoService } from './crypto.service';

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
    const value: string = "My secret message";
    const secret: string = await service.hashString("Super secret");
    const encryptedMessage: string = await service.encrypt(value, secret);
    expect(await service.decrypt(encryptedMessage, secret)).toBe(value);
  });
});
