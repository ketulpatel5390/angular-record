import { TestBed, inject } from '@angular/core/testing';

import { Addtolisteningroom } from './song-addinlisteningroom.service';


describe('Addtosongplaylist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Addtolisteningroom]
    });
  });

  it('should be created', inject([Addtolisteningroom], (service: Addtolisteningroom) => {
    expect(service).toBeTruthy();
  }));
});
