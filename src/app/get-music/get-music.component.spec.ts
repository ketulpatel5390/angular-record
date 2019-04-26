import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetMusicComponent } from './get-music.component';

describe('GetMusicComponent', () => {
  let component: GetMusicComponent;
  let fixture: ComponentFixture<GetMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
