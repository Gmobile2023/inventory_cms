import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { SubheaderModule } from '../../shared/common/sub-header/subheader.module';
import { EditInventoryModalComponent } from './edit-inventory-modal.component';
import { CreateInventoryModalModule } from '@app/shared/common/create-inventory-modal/create-inventory-modal.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    declarations: [InventoryComponent, EditInventoryModalComponent],
    imports: [AppSharedModule, InventoryRoutingModule, SubheaderModule, CreateInventoryModalModule, BreadcrumbModule],
})
export class InventoryModule {}
