import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvocatoriaEntidadComponent } from './convocatoria-entidad.component';

describe('ConvocatoriaEntidadComponent', () => {
  let component: ConvocatoriaEntidadComponent;
  let fixture: ComponentFixture<ConvocatoriaEntidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvocatoriaEntidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvocatoriaEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
