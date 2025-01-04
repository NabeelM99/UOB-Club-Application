import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollegeManagePage } from './college-manage.page';

describe('CollegeManagePage', () => {
  let component: CollegeManagePage;
  let fixture: ComponentFixture<CollegeManagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollegeManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
