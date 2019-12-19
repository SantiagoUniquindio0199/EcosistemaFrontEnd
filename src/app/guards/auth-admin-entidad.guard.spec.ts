import { TestBed, async, inject } from '@angular/core/testing';

import { AuthAdminEntidadGuard } from './auth-admin-entidad.guard';

describe('AuthAdminEntidadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAdminEntidadGuard]
    });
  });

  it('should ...', inject([AuthAdminEntidadGuard], (guard: AuthAdminEntidadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
