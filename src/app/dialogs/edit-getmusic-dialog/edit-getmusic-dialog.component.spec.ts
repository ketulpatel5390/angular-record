import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGetmusicDialogDialogComponent } from './edit-getmusic-dialog.component';

describe('EditGetmusicDialogDialogComponent', () => {
  let component: EditGetmusicDialogDialogComponent;
  let fixture: ComponentFixture<EditGetmusicDialogDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditGetmusicDialogDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGetmusicDialogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
