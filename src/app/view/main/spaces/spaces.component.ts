import { Component } from '@angular/core';
import { RuntimeSpaceConf } from 'src/app/model/runtime/runtime-space-conf';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { ScreenSize, StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.sass']
})
export class SpacesComponent {

  constructor(private stateService: StateService, private runtimeStorage: RuntimeStorageService) {
    this.runtimeStorage.init().then(() => {})
  }

  get screenSize(): ScreenSize {
    return this.stateService.getScreenSize();
  }

  get spaceConfs(): RuntimeSpaceConf[] {
    return this.runtimeStorage.getSpaceConfs();
  }

  openSettings(): void {
    console.log("opening settings");
  }

  openSpace(spaceId: string): void {
    console.log("opening", spaceId);
  }

  openAddSpace(): void {
    console.log("opening add space");
  }
}
