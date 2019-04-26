import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDistributionComponent } from './media-distribution.component';

describe('MediaDistributionComponent', () => {
  let component: MediaDistributionComponent;
  let fixture: ComponentFixture<MediaDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
