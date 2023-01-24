import { Component } from '@angular/core';
import { PersistentStorageService } from '../services/persistent-storage.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.sass']
})
export class FrameComponent {

  constructor(private persistentStorageService: PersistentStorageService) {}
  
}
