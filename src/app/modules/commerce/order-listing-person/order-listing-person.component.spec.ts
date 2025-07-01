import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListingPersonComponent } from './order-listing-person.component';

describe('OrderListingPersonComponent', () => {
  let component: OrderListingPersonComponent;
  let fixture: ComponentFixture<OrderListingPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListingPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderListingPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
