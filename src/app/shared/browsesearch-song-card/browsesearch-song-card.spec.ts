import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsesearchSongCardComponent } from './browsesearch-song-card.component';

describe('BrowsesearchSongCardComponent', () => {
  let component: BrowsesearchSongCardComponent;
  let fixture: ComponentFixture<BrowsesearchSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsesearchSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsesearchSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
