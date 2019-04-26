import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSongDialogComponent } from './edit-song-dialog.component';

describe('EditSongDialogComponent', () => {
  let component: EditSongDialogComponent;
  let fixture: ComponentFixture<EditSongDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSongDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSongDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
