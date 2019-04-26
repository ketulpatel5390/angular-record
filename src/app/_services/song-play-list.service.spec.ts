import { TestBed, inject } from '@angular/core/testing';

import { Addtosongplaylist } from './song-play-list.service';


describe('Addtosongplaylist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Addtosongplaylist]
    });
  });

  it('should be created', inject([Addtosongplaylist], (service: Addtosongplaylist) => {
    expect(service).toBeTruthy();
  }));
});
