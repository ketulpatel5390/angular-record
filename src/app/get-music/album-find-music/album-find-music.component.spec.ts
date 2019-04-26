import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumFindMusicComponent } from './album-find-music.component';

describe('AlbumFindMusicComponent', () => {
  let component: AlbumFindMusicComponent;
  let fixture: ComponentFixture<AlbumFindMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumFindMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumFindMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
