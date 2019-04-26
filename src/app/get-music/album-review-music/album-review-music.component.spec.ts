import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMusicalbumComponent } from './album-review-music.component';

describe('ReviewMusicalbumComponent', () => {
  let component: ReviewMusicalbumComponent;
  let fixture: ComponentFixture<ReviewMusicalbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewMusicalbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewMusicalbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
