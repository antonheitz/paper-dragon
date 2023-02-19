import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedComponent } from './locked.component';

describe('LockedComponent', () => {
  let component: LockedComponent;
  let fixture: ComponentFixture<LockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
