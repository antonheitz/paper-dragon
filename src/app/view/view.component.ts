import { Component } from '@angular/core';
import { RuntimeStorageService } from '../services/runtime-storage.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent {

  initialized: boolean = false

  constructor(private runtimeStorage: RuntimeStorageService) {
    this.runtimeStorage.init().then(() => {
      this.initialized = true;
    })
  }

  get locked(): boolean {
    if (!this.initialized) {
      return false;
    } else {
      return !this.runtimeStorage.spaces[this.runtimeStorage._getSpaceId()].spaceConf.decrypted;
    }
  }
}
