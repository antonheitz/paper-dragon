import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StateService } from 'src/app/services/state.service';

import { MainComponent } from './main.component';
import { SpacesComponent } from './spaces/spaces.component';
import { OverviewComponent } from './overview/overview.component';
import { FolderComponent } from './overview/folder/folder.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent, SpacesComponent, OverviewComponent, FolderComponent],
      imports: [
        BrowserAnimationsModule
      ],
      providers: [
        StateService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
