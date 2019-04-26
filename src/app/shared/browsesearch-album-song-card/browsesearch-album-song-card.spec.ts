import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsesearchalbumSongCardComponent } from './browsesearch-album-song-card.component';

describe('BrowsesearchalbumSongCardComponent', () => {
  let component: BrowsesearchalbumSongCardComponent;
  let fixture: ComponentFixture<BrowsesearchalbumSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsesearchalbumSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsesearchalbumSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
