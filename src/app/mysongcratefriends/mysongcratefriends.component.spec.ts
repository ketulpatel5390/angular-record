import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MysongcratefriendsComponent } from './mysongcratefriends.component';

describe('MysongcratefriendsComponent', () => {
  let component: MysongcratefriendsComponent;
  let fixture: ComponentFixture<MysongcratefriendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MysongcratefriendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MysongcratefriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
