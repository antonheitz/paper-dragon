import { Component } from '@angular/core';
import { CryptoService } from '../services/crypto.service';
import { PersistentStorageService } from '../services/persistent-storage.service';
import { RuntimeStorageService } from '../services/runtime-storage.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.sass']
})
export class FrameComponent {

  constructor(private runtimeStorage: RuntimeStorageService) {
    runtimeStorage.init()
  }
  
}
