import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareMusicComponent } from './share-music.component';

describe('ShareMusicComponent', () => {
  let component: ShareMusicComponent;
  let fixture: ComponentFixture<ShareMusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareMusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareMusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
