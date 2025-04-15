import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InventoryReportComponent } from './inventory-report.component';
import { InventoryReportRoutingModule } from './inventory-report-routing.module';
import { SimDetailModalComponent } from './sim-detail-modal.component';

@NgModule({
    declarations: [InventoryReportComponent, SimDetailModalComponent],
    imports: [AppSharedModule, InventoryReportRoutingModule, BreadcrumbModule],
})
export class InventoryReportModule {}
