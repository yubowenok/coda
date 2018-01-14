import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsetComponent } from './problemset.component';

describe('ProblemsetComponent', () => {
  let component: ProblemsetComponent;
  let fixture: ComponentFixture<ProblemsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
