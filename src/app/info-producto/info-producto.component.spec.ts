import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProductoComponent } from './info-producto.component';

describe('InfoProductoComponent', () => {
  let component: InfoProductoComponent;
  let fixture: ComponentFixture<InfoProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
