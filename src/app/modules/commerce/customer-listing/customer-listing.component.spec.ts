import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumerComponent } from './customer-listing.component';

describe('CostumerComponent', () => {
  let component: CostumerComponent;
  let fixture: ComponentFixture<CostumerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostumerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
