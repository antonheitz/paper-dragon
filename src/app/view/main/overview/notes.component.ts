import { Component } from '@angular/core';
import { RuntimeNote } from 'src/app/model/runtime/runtime-note';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.sass']
})
export class NotesComponent {

  createNote: boolean = false;
  createNoteTitle: string = "";

  constructor(private stateService: StateService, private runtimeStorage: RuntimeStorageService) { }

  openAddNote() {
    this.createNote = true;
  }

  addNoteTest() {
    console.log("adding note with title", this.createNoteTitle)
    this.createNoteTitle = "";
    this.createNote = false;
  }

  async addNote() {
    if (this.createNoteTitle.length > 0) {
      const newNote: RuntimeNote = {
        type: "note",
        encryptedKeys: ["name"],
        decrypted: true,
        name: this.createNoteTitle,
        _id: "",
        _rev: ""
      };
      const createdDocuemnt = await this.runtimeStorage.createDocument(newNote);
    }
    this.resetAddNote()
  }

  resetAddNote() {
    this.createNoteTitle = "";
    this.createNote = false;
  }

  get notes(): RuntimeNote[] {
    const currentSpace = this.stateService.getCurrentSpaceId();
    if (currentSpace === "") {
      return []
    }
    const space = this.runtimeStorage.space(currentSpace);
    return space.notes;
  }
}
