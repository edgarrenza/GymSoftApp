import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsMembershipsPage } from './clients-memberships.page';

describe('ClientsMembershipsPage', () => {
  let component: ClientsMembershipsPage;
  let fixture: ComponentFixture<ClientsMembershipsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsMembershipsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
