import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RuntimeStorageService } from 'src/app/services/runtime-storage.service';
import { StateService } from 'src/app/services/state.service';

import { SpacesComponent } from './spaces.component';

describe('SpacesComponent', () => {
  let component: SpacesComponent;
  let fixture: ComponentFixture<SpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpacesComponent ],
      imports: [
        MatIconModule,
      ],
      providers: [ StateService, RuntimeStorageService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
