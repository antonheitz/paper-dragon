import { Component } from '@angular/core';
import { RuntimeNote } from 'src/app/model/runtime/runtime-note';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {

  constructor(private stateService: StateService, private runtimeStorage: RuntimeStorageService) { }

  openAllNotes(): void {
    console.log("open all notes", this.stateService.getCurrentSpaceId())
    console.log()
  }

  openStarredNotes(): void {
    console.log("open starred notes")
  }

  openDeletedNotes(): void {
    console.log("open all notes")
  }

  get notes(): RuntimeNote[] {
    const currentSpace = this.stateService.getCurrentSpaceId();
    if (currentSpace === "") {
      return []
    }
    return this.runtimeStorage.space(currentSpace).notes;
  }
}
