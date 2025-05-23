import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabViewModule } from 'primeng/tabview';
import { DetailInventoryExportComponent } from './detail-inventory-export.component';
import { DetailInventoryExportRoutingModule } from './detail-inventory-export-routing.module';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [DetailInventoryExportComponent],
    imports: [AppSharedModule, DetailInventoryExportRoutingModule, BreadcrumbModule, TabViewModule, FileUploadModule],
})
export class DetailInventoryExportModule {}
