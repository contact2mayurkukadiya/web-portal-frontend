import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableColumnHeaderComponent } from './table-column-header.component';

describe('TableColumnHeaderComponent', () => {
  let component: TableColumnHeaderComponent;
  let fixture: ComponentFixture<TableColumnHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableColumnHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
