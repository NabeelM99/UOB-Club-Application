import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollegeEventsPage } from './college-events.page';

describe('CollegeEventsPage', () => {
  let component: CollegeEventsPage;
  let fixture: ComponentFixture<CollegeEventsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollegeEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
