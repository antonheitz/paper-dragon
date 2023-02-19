import { Component, Input } from '@angular/core';
import { CryptoService } from 'src/app/services/crypto.service';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { ScreenSize, StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-locked',
  templateUrl: './locked.component.html',
  styleUrls: ['./locked.component.sass']
})
export class LockedComponent {

  @Input("initialized") initialized: boolean = false;

  constructor(private runtimeStorage: RuntimeStorageService, private stateService: StateService) { }

  get doubblePwHash(): string {
    return this.runtimeStorage.spaces[this.runtimeStorage._getSpaceId()].spaceConf.pwDoubleHash;
  }

  get registered(): boolean {
    if (this.initialized) {
      return this.doubblePwHash !== "";
    } else {
      return false;
    }
  }

  get screenSize(): ScreenSize {
    return this.stateService.getScreenSize();
  }
}
