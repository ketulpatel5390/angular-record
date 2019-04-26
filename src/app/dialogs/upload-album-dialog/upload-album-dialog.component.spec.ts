import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAlbumDialogComponent } from './upload-album-dialog.component';

describe('UploadAlbumDialogComponent', () => {
  let component: UploadAlbumDialogComponent;
  let fixture: ComponentFixture<UploadAlbumDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadAlbumDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAlbumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
