import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { TableColumnHeaderComponent } from './table-column-header/table-column-header.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';

const components = [
  TableColumnHeaderComponent,
  TablePaginationComponent,
  TableHeaderComponent
]

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule
  ],
  exports: [components]
})
export class WidgetComponentsModule { }
