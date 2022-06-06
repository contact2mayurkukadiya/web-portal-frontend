import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '../ng-zorro-antd.module';
import { WidgetComponentsModule } from '../widget-components/widget-components.module';
import { TableComponent } from './table/table.component';

const components = [
  TableComponent
];

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    WidgetComponentsModule
  ],
  exports: [
    components
  ]
})
export class WidgetModule { }
