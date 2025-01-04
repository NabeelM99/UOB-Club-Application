import { TestBed } from '@angular/core/testing';

import { RetrieveEventsService } from './retrieve-events.service';

describe('RetrieveEventsService', () => {
  let service: RetrieveEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
