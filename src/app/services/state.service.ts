import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';

export type ScreenSize = "big" | "medium" | "small";
export type CurrentMainView = "spaces" | "notes" | "entries" | "editor"

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private observer: BreakpointObserver) {
    // Screen size breakpoints
    const bigBreakpoint: string = '(max-width: 900px)';
    const mediumBreakpoint: string = '(max-width: 450px)';
    this.observer.observe([bigBreakpoint, mediumBreakpoint]).subscribe((res) => {
      if (res.breakpoints[mediumBreakpoint]) {
        this.setScreenSize("small");
      } else if (res.breakpoints[bigBreakpoint]) {
        this.setScreenSize("medium");
      } else {
        this.setScreenSize("big");
      }
    });
  }

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

  private currentSpaceId: string = "";

  setCurrentSpaceId(spaceId: string): void {
    this.currentSpaceId = spaceId;
  }

  getCurrentSpaceId(): string {
    return this.currentSpaceId;
  }

  private currentNoteId: string = "";

  setCurrentNoteId(noteId: string): void {
    this.currentNoteId = noteId;
  }

  getCurrentNoteId(): string {
    return this.currentNoteId;
  }
}
