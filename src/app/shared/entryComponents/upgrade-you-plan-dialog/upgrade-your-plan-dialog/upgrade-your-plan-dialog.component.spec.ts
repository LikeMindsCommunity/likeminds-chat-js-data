import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeYourPlanDialogComponent } from './upgrade-your-plan-dialog.component';

describe('UpgradeYourPlanDialogComponent', () => {
  let component: UpgradeYourPlanDialogComponent;
  let fixture: ComponentFixture<UpgradeYourPlanDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeYourPlanDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeYourPlanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
