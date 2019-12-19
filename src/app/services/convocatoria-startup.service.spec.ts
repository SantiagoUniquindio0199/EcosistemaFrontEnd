import { TestBed, inject } from '@angular/core/testing';

import { ConvocatoriaStartupService } from './convocatoria-startup.service';

describe('ConvocatoriaStartupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvocatoriaStartupService]
    });
  });

  it('should be created', inject([ConvocatoriaStartupService], (service: ConvocatoriaStartupService) => {
    expect(service).toBeTruthy();
  }));
});
