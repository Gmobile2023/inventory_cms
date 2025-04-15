import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DetailInventoryImportComponent } from './detail-inventory-import.component';
import { DetailInventoryImportRoutingModule } from './detail-inventory-import-routing.module';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [DetailInventoryImportComponent],
    imports: [AppSharedModule, DetailInventoryImportRoutingModule, BreadcrumbModule, TabViewModule, FileUploadModule],
})
export class DetailInventoryImportModule {}
