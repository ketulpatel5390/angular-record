import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAlbumSongCardComponent } from './admin-album-song-card.component';

describe('AdminAlbumSongCardComponent', () => {
  let component: AdminAlbumSongCardComponent;
  let fixture: ComponentFixture<AdminAlbumSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAlbumSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAlbumSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
