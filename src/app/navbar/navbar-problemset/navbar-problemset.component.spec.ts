import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarProblemsetComponent } from './navbar-problemset.component';

describe('NavbarProblemsetComponent', () => {
  let component: NavbarProblemsetComponent;
  let fixture: ComponentFixture<NavbarProblemsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarProblemsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarProblemsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
