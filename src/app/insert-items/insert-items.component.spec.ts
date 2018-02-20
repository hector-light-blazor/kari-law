import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertItemsComponent } from './insert-items.component';

describe('InsertItemsComponent', () => {
  let component: InsertItemsComponent;
  let fixture: ComponentFixture<InsertItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
