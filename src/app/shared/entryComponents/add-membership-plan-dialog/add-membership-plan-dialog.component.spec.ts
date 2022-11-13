import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMembershipPlanDialogComponent } from './add-membership-plan-dialog.component';

describe('AddMembershipPlanDialogComponent', () => {
  let component: AddMembershipPlanDialogComponent;
  let fixture: ComponentFixture<AddMembershipPlanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMembershipPlanDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMembershipPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
