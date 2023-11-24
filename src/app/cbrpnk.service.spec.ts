import { TestBed } from '@angular/core/testing';

import { CbrpnkService } from './cbrpnk.service';

describe('CbrpnkService', () => {
  let service: CbrpnkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CbrpnkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
