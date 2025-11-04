import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedXmlComponent } from './imported-xml.component';

describe('ImportedXmlComponent', () => {
  let component: ImportedXmlComponent;
  let fixture: ComponentFixture<ImportedXmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportedXmlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportedXmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
