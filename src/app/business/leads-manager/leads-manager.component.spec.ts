import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsManagerComponent } from './leads-manager.component';

describe('LeadsManagerComponent', () => {
  let component: LeadsManagerComponent;
  let fixture: ComponentFixture<LeadsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
