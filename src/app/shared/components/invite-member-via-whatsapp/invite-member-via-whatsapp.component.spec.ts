import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMemberViaWhatsappComponent } from './invite-member-via-whatsapp.component';

describe('InviteMemberViaWhatsappComponent', () => {
  let component: InviteMemberViaWhatsappComponent;
  let fixture: ComponentFixture<InviteMemberViaWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMemberViaWhatsappComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMemberViaWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
