import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppReviewComponent } from './app-review.component';

describe('AppReviewComponent', () => {
  let component: AppReviewComponent;
  let fixture: ComponentFixture<AppReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
