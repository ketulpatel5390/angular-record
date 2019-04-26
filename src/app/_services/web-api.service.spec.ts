import { TestBed, inject } from '@angular/core/testing';

import { WebApiServiceService } from './web-api-service.service';

describe('WebApiServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebApiServiceService]
    });
  });

  it('should be created', inject([WebApiServiceService], (service: WebApiServiceService) => {
    expect(service).toBeTruthy();
  }));
});
