import { TestBed, inject } from '@angular/core/testing';

import { EventPageService } from './event-page.service';

describe('EventPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventPageService]
    });
  });

  it('should be created', inject([EventPageService], (service: EventPageService) => {
    expect(service).toBeTruthy();
  }));
});
