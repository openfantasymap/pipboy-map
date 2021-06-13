import { TestBed } from '@angular/core/testing';

import { OfmService } from './ofm.service';

describe('OfmService', () => {
  let service: OfmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
