import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListingComponent } from './view-listing.component';

describe('ViewListingComponent', () => {
  let component: ViewListingComponent;
  let fixture: ComponentFixture<ViewListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
