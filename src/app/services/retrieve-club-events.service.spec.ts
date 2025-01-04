import { TestBed } from '@angular/core/testing';

import { RetrieveClubEventsService } from './retrieve-club-events.service';

describe('RetrieveClubEventsService', () => {
  let service: RetrieveClubEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetrieveClubEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
