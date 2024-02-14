import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingsGalleryComponent } from './listings-gallery.component';

describe('ListingsGalleryComponent', () => {
  let component: ListingsGalleryComponent;
  let fixture: ComponentFixture<ListingsGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingsGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListingsGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
