import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMusicComponent } from './review-music.component';

describe('ReviewMusicComponent', () => {
  let component: ReviewMusicComponent;
  let fixture: ComponentFixture<ReviewMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
