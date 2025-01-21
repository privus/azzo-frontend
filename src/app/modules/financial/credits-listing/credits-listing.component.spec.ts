import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditsListingComponent } from './credits-listing.component';

describe('CreditsListingComponent', () => {
  let component: CreditsListingComponent;
  let fixture: ComponentFixture<CreditsListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditsListingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
