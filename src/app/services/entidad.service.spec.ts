import { TestBed, inject } from '@angular/core/testing';

import { EntidadService } from './entidad.service';

describe('EntidadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntidadService]
    });
  });

  it('should be created', inject([EntidadService], (service: EntidadService) => {
    expect(service).toBeTruthy();
  }));
});
