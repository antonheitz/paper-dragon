import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private cryptoService: CryptoService) { }

  loadPersonalSpace(): Promise<void> {
    return new Promise((resolve, reject) => {

    });
  }

}
