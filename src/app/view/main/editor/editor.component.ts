import { Component } from '@angular/core';
import { RuntimeEntry } from 'src/app/model/runtime/runtime-entry';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.sass']
})
export class EditorComponent {

  constructor(private stateService: StateService) { }

  get currentNote(): boolean {
    return this.stateService.getCurrentNoteId() !== "";
  }

  get entries(): RuntimeEntry[] {
    return []
  }
}
