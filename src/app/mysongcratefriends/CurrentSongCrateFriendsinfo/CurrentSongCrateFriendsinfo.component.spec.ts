import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentSongCrateFriendsinfoComponent } from './CurrentSongCrateFriendsinfo.component';

describe('CurrentSongCrateFriendsinfoComponent', () => {
  let component: CurrentSongCrateFriendsinfoComponent;
  let fixture: ComponentFixture<CurrentSongCrateFriendsinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentSongCrateFriendsinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentSongCrateFriendsinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
