import { TestBed, async, inject } from '@angular/core/testing';

import { AuthAdminStartupGuard } from './auth-admin-startup.guard';

describe('AuthAdminStartupGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAdminStartupGuard]
    });
  });

  it('should ...', inject([AuthAdminStartupGuard], (guard: AuthAdminStartupGuard) => {
    expect(guard).toBeTruthy();
  }));
});
