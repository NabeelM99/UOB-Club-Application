import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FineArtsPage } from './fine-arts.page';

describe('FineArtsPage', () => {
  let component: FineArtsPage;
  let fixture: ComponentFixture<FineArtsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FineArtsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
