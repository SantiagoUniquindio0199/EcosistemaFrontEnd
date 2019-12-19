import { TestBed, async, inject } from '@angular/core/testing';

import { AuthStartupEntidadGuard } from './auth-startup-entidad.guard';

describe('AuthStartupEntidadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthStartupEntidadGuard]
    });
  });

  it('should ...', inject([AuthStartupEntidadGuard], (guard: AuthStartupEntidadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
