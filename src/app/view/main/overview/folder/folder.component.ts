import { Component, Input } from '@angular/core';
import { RuntimeFolder } from 'src/app/model/runtime/runtime-folder';

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

  open: boolean = true;

  showFolderContent(name: string): void {
    console.log("show content of folder", name)
  }

  toggleFolder(): void {
    this.open = !this.open;
  }

  subFolders(): RuntimeFolder[] {
    const allFolders: RuntimeFolder[] = [
      {
        type: 'folder',
        decrypted: true,
        _id: '1',
        _rev: '',
        encryptedKeys: ['name'],
        name: "Subfolder 1",
        parent: ''
      },
      {
        type: 'folder',
        decrypted: true,
        _id: '2',
        _rev: '',
        encryptedKeys: ['name'],
        name: "Subfolder 2",
        parent: ''
      },
      {
        type: 'folder',
        decrypted: true,
        _id: '3',
        _rev: '',
        encryptedKeys: ['name'],
        name: "Subfolder 3",
        parent: ''
      }
      ,
      {
        type: 'folder',
        decrypted: true,
        _id: '4',
        _rev: '',
        encryptedKeys: ['name'],
        name: "Subfolder 4",
        parent: '2'
      }
    ];
    return allFolders.filter(item => item.parent === this.folder._id);
  } 
}
