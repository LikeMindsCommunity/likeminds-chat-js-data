import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMemberViaEmailComponent } from './invite-member-via-email.component';

describe('InviteMemberViaEmailComponent', () => {
  let component: InviteMemberViaEmailComponent;
  let fixture: ComponentFixture<InviteMemberViaEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMemberViaEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteMemberViaEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
