import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumSongCardComponent } from './album-song-card.component';

describe('AlbumSongCardComponent', () => {
  let component: AlbumSongCardComponent;
  let fixture: ComponentFixture<AlbumSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
