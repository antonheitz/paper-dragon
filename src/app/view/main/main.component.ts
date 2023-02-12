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

  currentResizing: HTMLElement | null = null;
  width: number = 0;
  original_x: number = 0;

  startResize(event: MouseEvent): void {
    this.currentResizing = ((event.target as HTMLElement).parentElement as HTMLElement);
    this.width = this.currentResizing.clientWidth;
    this.original_x = event.clientX;
  }

  resize(event: MouseEvent): void {
    if (this.currentResizing !== null) {
      this.currentResizing.style.width = `${(this.width + event.clientX - this.original_x)}px`;
    }
  }

  endResize(event: MouseEvent): void {
    if (this.currentResizing !== null) {
      this.currentResizing = null;
    }
  }
}
