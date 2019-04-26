import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFeedbackDialogComponent } from './confirm-feedback-dialog.component';

describe('ConfirmFeedbackDialogComponent', () => {
  let component: ConfirmFeedbackDialogComponent;
  let fixture: ComponentFixture<ConfirmFeedbackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmFeedbackDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
