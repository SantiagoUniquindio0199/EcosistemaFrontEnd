import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoConvocatoriaComponent } from './info-convocatoria.component';

describe('InfoConvocatoriaComponent', () => {
  let component: InfoConvocatoriaComponent;
  let fixture: ComponentFixture<InfoConvocatoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoConvocatoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoConvocatoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
