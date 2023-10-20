import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntriesComponent } from './entries.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('EntriesComponent', () => {
  let component: EntriesComponent;
  let fixture: ComponentFixture<EntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntriesComponent],
      imports: [FormsModule, CommonModule],
      providers: []
    })
      .compileComponents();

    fixture = TestBed.createComponent(EntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
