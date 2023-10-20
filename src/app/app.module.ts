import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ViewComponent } from './view/view.component';
import { MainComponent } from './view/main/main.component';
import { SpacesComponent } from './view/main/spaces/spaces.component';

import { MatIconModule } from '@angular/material/icon';
import { NotesComponent } from './view/main/notes/notes.component';
import { LockedComponent } from './view/locked/locked.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './view/locked/login/login.component';
import { RegisterComponent } from './view/locked/register/register.component';
import { EntriesComponent } from './view/main/entries/entries.component';
import { EditorComponent } from './view/main/editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    MainComponent,
    SpacesComponent,
    NotesComponent,
    LockedComponent,
    LoginComponent,
    RegisterComponent,
    EntriesComponent,
    EditorComponent
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
