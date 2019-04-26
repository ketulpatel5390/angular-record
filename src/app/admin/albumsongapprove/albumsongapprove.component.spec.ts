import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsongapproveComponent } from './albumsongapprove.component';

describe('AlbumsongapproveComponent', () => {
  let component: AlbumsongapproveComponent;
  let fixture: ComponentFixture<AlbumsongapproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumsongapproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumsongapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
