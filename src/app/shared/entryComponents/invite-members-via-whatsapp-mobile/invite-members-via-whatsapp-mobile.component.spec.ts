import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMembersViaWhatsappMobileComponent } from './invite-members-via-whatsapp-mobile.component';

describe('InviteMembersViaWhatsappMobileComponent', () => {
  let component: InviteMembersViaWhatsappMobileComponent;
  let fixture: ComponentFixture<InviteMembersViaWhatsappMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMembersViaWhatsappMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMembersViaWhatsappMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
