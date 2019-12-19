import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoStartupComponent } from './producto-startup.component';

describe('ProductoStartupComponent', () => {
  let component: ProductoStartupComponent;
  let fixture: ComponentFixture<ProductoStartupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductoStartupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
