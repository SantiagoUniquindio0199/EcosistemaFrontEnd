import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEntidadComponent } from './info-entidad.component';

describe('InfoEntidadComponent', () => {
  let component: InfoEntidadComponent;
  let fixture: ComponentFixture<InfoEntidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoEntidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
