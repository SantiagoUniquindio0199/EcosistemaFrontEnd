import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalStartupComponent } from './principal-startup.component';

describe('PrincipalStartupComponent', () => {
  let component: PrincipalStartupComponent;
  let fixture: ComponentFixture<PrincipalStartupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrincipalStartupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrincipalStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
