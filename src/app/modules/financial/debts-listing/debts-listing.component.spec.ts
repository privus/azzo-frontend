import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtsListingComponent } from './debts-listing.component';

describe('DebtsListingComponent', () => {
  let component: DebtsListingComponent;
  let fixture: ComponentFixture<DebtsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebtsListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebtsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
