import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoStartupComponent } from './info-startup.component';

describe('InfoStartupComponent', () => {
  let component: InfoStartupComponent;
  let fixture: ComponentFixture<InfoStartupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoStartupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
