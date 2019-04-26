import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongApproveComponent } from './songapprove.component';

describe('SongApproveComponent', () => {
  let component: SongApproveComponent;
  let fixture: ComponentFixture<SongApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
