import { TestBed } from '@angular/core/testing';

import { ClientMembershipService } from './client-membership.service';

describe('ClientMembershipService', () => {
  let service: ClientMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientMembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
