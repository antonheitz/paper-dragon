import { Component } from '@angular/core';
import { RuntimeEntry } from 'src/app/model/runtime/runtime-entry';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.sass']
})
export class EntriesComponent {

  createEntry: boolean = false;
  createEntryTitle: string = "";

  constructor(private stateService: StateService, private runtimeStorage: RuntimeStorageService) { }

  openAddEntry() {
    this.createEntry = true;
  }

  addEntryTest() {
    console.log("adding entry with title", this.createEntryTitle)
    this.createEntryTitle = "";
    this.createEntry = false;
  }

  async addEntry() {
    if (this.createEntryTitle.length > 0) {
      const newNote: RuntimeEntry = {
        type: "entry",
        encryptedKeys: ["title", "content"],
        decrypted: true,
        title: this.createEntryTitle,
        content: "",
        noteId: this.stateService.getCurrentNoteId(),
        _id: "",
        _rev: ""
      };
      const createdDocuemnt = await this.runtimeStorage.createDocument(newNote);
    }
    this.resetAddEntry()
  }

  resetAddEntry() {
    this.createEntryTitle = "";
    this.createEntry = false;
  }

  get selectedNote(): boolean {
    return this.stateService.getCurrentNoteId() !== "";
  }

  get entries(): RuntimeEntry[] {
    const spaceId: string = this.stateService.getCurrentSpaceId();
    if (!spaceId) {
      return [];
    }
    const noteId: string = this.stateService.getCurrentNoteId();
    return this.runtimeStorage.space(spaceId).entries.filter(entry => {
      entry.noteId === noteId;
    })
  }
}
