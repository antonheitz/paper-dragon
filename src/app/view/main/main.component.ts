import { Component, ViewChild } from '@angular/core';
import { StateService, ScreenSize, CurrentMainView } from 'src/app/services/state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {

  constructor(private stateService: StateService) { }

  get screenSize(): ScreenSize {
    return this.stateService.getScreenSize();
  }

  get currentMainView(): CurrentMainView {
    return this.stateService.getCurrentMainView();
  }
}
