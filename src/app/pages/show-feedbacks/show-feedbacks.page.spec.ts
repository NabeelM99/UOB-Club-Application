import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowFeedbacksPage } from './show-feedbacks.page';

describe('ShowFeedbacksPage', () => {
  let component: ShowFeedbacksPage;
  let fixture: ComponentFixture<ShowFeedbacksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ShowFeedbacksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
