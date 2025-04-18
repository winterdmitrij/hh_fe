import { TestBed } from '@angular/core/testing';

import { AccountgroupService } from './accountgroup.service';

describe('AccountgroupService', () => {
  let service: AccountgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
