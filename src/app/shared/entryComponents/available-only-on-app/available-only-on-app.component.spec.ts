import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableOnlyOnAppComponent } from './available-only-on-app.component';

describe('AvailableOnlyOnAppComponent', () => {
  let component: AvailableOnlyOnAppComponent;
  let fixture: ComponentFixture<AvailableOnlyOnAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableOnlyOnAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableOnlyOnAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
