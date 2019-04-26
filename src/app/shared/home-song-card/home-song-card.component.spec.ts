import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSongCardComponent } from './home-song-card.component';

describe('HomeSongCardComponent', () => {
  let component: HomeSongCardComponent;
  let fixture: ComponentFixture<HomeSongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSongCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
