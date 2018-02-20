import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclaimerMessageBoxComponent } from './disclaimer-message-box.component';

describe('DisclaimerMessageBoxComponent', () => {
  let component: DisclaimerMessageBoxComponent;
  let fixture: ComponentFixture<DisclaimerMessageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclaimerMessageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimerMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
