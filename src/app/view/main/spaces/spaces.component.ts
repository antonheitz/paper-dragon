import { Component } from '@angular/core';
import { ScreenSize, StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.sass']
})
export class SpacesComponent {

  constructor(private stateService: StateService) { }

  get screenSize(): ScreenSize {
    return this.stateService.getScreenSize();
  }
}
