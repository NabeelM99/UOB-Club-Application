import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatedEventsPage } from './created-events.page';

describe('CreatedEventsPage', () => {
  let component: CreatedEventsPage;
  let fixture: ComponentFixture<CreatedEventsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatedEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
