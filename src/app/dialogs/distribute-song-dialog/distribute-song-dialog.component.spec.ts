import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeSongDialogComponent } from './distribute-song-dialog.component';

describe('DistributeSongDialogComponent', () => {
  let component: DistributeSongDialogComponent;
  let fixture: ComponentFixture<DistributeSongDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributeSongDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeSongDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
