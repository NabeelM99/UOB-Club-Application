import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyEventDetailsPage } from './my-event-details.page';

describe('MyEventDetailsPage', () => {
  let component: MyEventDetailsPage;
  let fixture: ComponentFixture<MyEventDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MyEventDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
