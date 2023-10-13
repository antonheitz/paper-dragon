import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedComponent } from './locked.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('LockedComponent', () => {
  let component: LockedComponent;
  let fixture: ComponentFixture<LockedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LockedComponent, LoginComponent, RegisterComponent],
      providers: [],
      imports: [FormsModule, CommonModule]
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
