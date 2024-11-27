import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SubheaderModule } from '../../shared/common/sub-header/subheader.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    declarations: [InventoryComponent],
    imports: [AppSharedModule, InventoryRoutingModule, SubheaderModule, BreadcrumbModule],
})
export class InventoryModule {}
