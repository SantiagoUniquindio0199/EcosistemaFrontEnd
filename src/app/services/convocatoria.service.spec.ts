import { TestBed, inject } from '@angular/core/testing';

import { ConvocatoriaService } from './convocatoria.service';

describe('ConvocatoriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvocatoriaService]
    });
  });

  it('should be created', inject([ConvocatoriaService], (service: ConvocatoriaService) => {
    expect(service).toBeTruthy();
  }));
});
