import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMembersViaEmailMobileComponent } from './invite-members-via-email-mobile.component';

describe('InviteMembersViaEmailMobileComponent', () => {
  let component: InviteMembersViaEmailMobileComponent;
  let fixture: ComponentFixture<InviteMembersViaEmailMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMembersViaEmailMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMembersViaEmailMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
