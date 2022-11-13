import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowNotificationSheetComponent } from './allow-notification-sheet.component';

describe('AllowNotificationSheetComponent', () => {
  let component: AllowNotificationSheetComponent;
  let fixture: ComponentFixture<AllowNotificationSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowNotificationSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowNotificationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
