import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalEntidadComponent } from './principal-entidad.component';

describe('PrincipalEntidadComponent', () => {
  let component: PrincipalEntidadComponent;
  let fixture: ComponentFixture<PrincipalEntidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalEntidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
