import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageActiveComponent } from './message-active.component';

describe('MessageActiveComponent', () => {
  let component: MessageActiveComponent;
  let fixture: ComponentFixture<MessageActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageActiveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
