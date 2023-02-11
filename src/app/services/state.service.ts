import { Injectable } from '@angular/core';

export type ScreenSize = "big" | "medium" | "small";
export type CurrentMainView = "spaces" | "folder" | "files" | "editor"

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  private screenSize: ScreenSize = "big";

  setScreenSize(type: ScreenSize): void {
    this.screenSize = type;
  }

  getScreenSize(): ScreenSize {
    return this.screenSize;
  }

  private currentMainView: CurrentMainView = "spaces";

  setCurrentMainView(view: CurrentMainView): void {
    this.currentMainView = view;
  }

  getCurrentMainView(): CurrentMainView {
    return this.currentMainView;
  }
}
