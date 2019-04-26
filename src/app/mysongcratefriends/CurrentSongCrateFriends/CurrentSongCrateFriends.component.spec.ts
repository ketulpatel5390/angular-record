import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSongCrateFriendsComponent } from './CurrentSongCrateFriends.component';

describe('CurrentSongCrateFriendsComponent', () => {
  let component: CurrentSongCrateFriendsComponent;
  let fixture: ComponentFixture<CurrentSongCrateFriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSongCrateFriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSongCrateFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
