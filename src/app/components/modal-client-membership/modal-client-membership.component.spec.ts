import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalClientMembershipComponent } from './modal-client-membership.component';

describe('ModalClientMembershipComponent', () => {
  let component: ModalClientMembershipComponent;
  let fixture: ComponentFixture<ModalClientMembershipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ModalClientMembershipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalClientMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
