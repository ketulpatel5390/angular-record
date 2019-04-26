import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditfeedbackDialogComponent } from './edit-feedback-dialog.component';

describe('EditfeedbackDialogComponent', () => {
  let component: EditfeedbackDialogComponent;
  let fixture: ComponentFixture<EditfeedbackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditfeedbackDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditfeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
