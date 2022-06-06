import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { ExportHistoryComponent } from './components/export-history/export-history.component';
import { UserFormComponent } from './components/user-form/user-form.component';
// import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { WidgetModule } from './widgets/widget.module';

@NgModule({
  declarations: [UserFormComponent, UserDetailsComponent, DocumentListComponent, DeviceListComponent, ExportHistoryComponent],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    WidgetModule,
  ],
  exports: [
    NgZorroAntdModule,
    ReactiveFormsModule,
    FormsModule,
    WidgetModule,
    UserFormComponent,
    UserDetailsComponent,
    DocumentListComponent,
    DeviceListComponent,
    ExportHistoryComponent
  ],
})
export class SharedModule { }
