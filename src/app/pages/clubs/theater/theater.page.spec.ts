import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheaterPage } from './theater.page';

describe('TheaterPage', () => {
  let component: TheaterPage;
  let fixture: ComponentFixture<TheaterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TheaterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
