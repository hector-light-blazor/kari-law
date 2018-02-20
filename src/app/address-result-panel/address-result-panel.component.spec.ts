import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressResultPanelComponent } from './address-result-panel.component';

describe('AddressResultPanelComponent', () => {
  let component: AddressResultPanelComponent;
  let fixture: ComponentFixture<AddressResultPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressResultPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressResultPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
