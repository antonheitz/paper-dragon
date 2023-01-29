import { Component } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { PersistentStorageService } from '../services/persistent-storage.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.sass']
})
export class FrameComponent {

  constructor(private persistentStorageService: PersistentStorageService, private cryptoService: CryptoService) {}
  
}
