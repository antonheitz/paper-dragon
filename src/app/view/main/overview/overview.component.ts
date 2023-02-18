import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {

  openAllNotes(): void {
    console.log("open all notes")
  }

  openStarredNotes(): void {
    console.log("open starred notes")
  }

  openDeletedNotes(): void {
    console.log("open all notes")
  }

}
