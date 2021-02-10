import { TestBed } from '@angular/core/testing';

import { LocationLanguageService } from './location-language.service';

describe('LocationLanguageService', () => {
  let service: LocationLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
