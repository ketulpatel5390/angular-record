import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSongDialogComponent } from './upload-song-dialog.component';

describe('UploadSongDialogComponent', () => {
  let component: UploadSongDialogComponent;
  let fixture: ComponentFixture<UploadSongDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSongDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSongDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
