import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StateService, ScreenSize, CurrentMainView } from 'src/app/services/state.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent {

  constructor(private observer: BreakpointObserver, private stateService: StateService) { }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.stateService.setScreenSize("medium");
      } else {
        this.stateService.setScreenSize("big");
      }
    });
    this.observer.observe(['(max-width: 450px)']).subscribe((res) => {
      if (res.matches) {
        this.stateService.setScreenSize("small");
      } else {
        this.stateService.setScreenSize("medium");
      }
    });
  }

  get screenSize(): ScreenSize {
    return this.stateService.getScreenSize();
  }

  get currentMainView(): CurrentMainView {
    return this.stateService.getCurrentMainView();
  }
}
