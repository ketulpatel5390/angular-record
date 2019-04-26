import { TestBed, inject } from '@angular/core/testing';

import { SongUploadService } from './song-upload.service';

describe('SongUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SongUploadService]
    });
  });

  it('should be created', inject([SongUploadService], (service: SongUploadService) => {
    expect(service).toBeTruthy();
  }));
});
