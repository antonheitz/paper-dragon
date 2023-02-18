import { Component, Input } from '@angular/core';
import { RuntimeFolder } from 'src/app/model/runtime/runtime-folder';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.sass']
})
export class FolderComponent {

  @Input('folder') folder: RuntimeFolder = {
    type: 'folder',
    decrypted: true,
    _id: '',
    _rev: '',
    encryptedKeys: ['name'],
    name: "Root Folder",
    parent: ''
  }

  constructor(private runtimeStorageService: RuntimeStorageService, private stateService: StateService) { }

  open: boolean = true;

  showFolderContent(name: string): void {
    console.log("show content of folder", name)
  }

  toggleFolder(): void {
    this.open = !this.open;
  }

  get subFolders(): RuntimeFolder[] {
    if (this.stateService.getCurrentSpaceId() === "") {
      return [];
    } else {
      return this.runtimeStorageService.spaces[this.stateService.getCurrentSpaceId()].folder.filter(item => item.parent === this.folder._id);
    }
    } 
}
