import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewComponent } from './view/view.component';
import { MainComponent } from './view/main/main.component';
import { SpacesComponent } from './view/main/spaces/spaces.component';

import { MatIconModule } from '@angular/material/icon';
import { OverviewComponent } from './view/main/overview/overview.component';
import { FolderComponent } from './view/main/overview/folder/folder.component';
import { LockedComponent } from './view/locked/locked.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    MainComponent,
    SpacesComponent,
    OverviewComponent,
    FolderComponent,
    LockedComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    FormsModule,
    // angular material
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
