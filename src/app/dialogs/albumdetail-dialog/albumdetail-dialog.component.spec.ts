import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumdetailDialogComponent } from './albumdetail-dialog.component';

describe('AlbumdetailDialogComponent', () => {
  let component: AlbumdetailDialogComponent;
  let fixture: ComponentFixture<AlbumdetailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumdetailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumdetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
