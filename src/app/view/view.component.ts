import { Component, OnInit } from '@angular/core';
import { RuntimeStorageService } from '../services/runtime-storage.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.sass']
})
export class ViewComponent implements OnInit {

  initialized: boolean = false

  constructor(private runtimeStorage: RuntimeStorageService) { }

  async ngOnInit(): Promise<void> {
    await this.runtimeStorage.init();
    this.initialized = true;
  }

  get unlocked(): boolean {
    if (!this.initialized) {
      return false;
    } else {
      return this.runtimeStorage.spaces[this.runtimeStorage._getSpaceId()].spaceConf.decrypted;
    }
  }
}
