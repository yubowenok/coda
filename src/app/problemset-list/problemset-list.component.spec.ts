import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemsetListComponent } from './problemset-list.component';

describe('ProblemsetListComponent', () => {
  let component: ProblemsetListComponent;
  let fixture: ComponentFixture<ProblemsetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemsetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemsetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
