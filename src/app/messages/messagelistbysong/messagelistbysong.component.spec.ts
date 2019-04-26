import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagelistbysongComponent } from './messagelistbysong.component';

describe('MessagelistbysongComponent', () => {
  let component: MessagelistbysongComponent;
  let fixture: ComponentFixture<MessagelistbysongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagelistbysongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagelistbysongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
