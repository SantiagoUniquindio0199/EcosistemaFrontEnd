import { TestBed, async, inject } from '@angular/core/testing';

import { AuthAdmStartupEntidadGuard } from './auth-adm-startup-entidad.guard';

describe('AuthAdmStartupEntidadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAdmStartupEntidadGuard]
    });
  });

  it('should ...', inject([AuthAdmStartupEntidadGuard], (guard: AuthAdmStartupEntidadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
