import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InventoryImportExportComponent } from './inventory-import-export.component';
import { InventoryImportExportRoutingModule } from './inventory-import-export-routing.module';

@NgModule({
    declarations: [InventoryImportExportComponent],
    imports: [AppSharedModule, InventoryImportExportRoutingModule, BreadcrumbModule],
})
export class InventoryImportExportModule {}
