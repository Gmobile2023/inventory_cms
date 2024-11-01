import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { WarehouseComponent } from './warehouse.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { SubheaderModule } from '../../shared/common/sub-header/subheader.module';
import { EditWarehouseModalComponent } from './edit-warehouse-modal.component';
import { CreateWarehouseModalModule } from '@app/shared/common/create-warehouse-modal/create-warehouse-modal.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    declarations: [WarehouseComponent, EditWarehouseModalComponent],
    imports: [AppSharedModule, WarehouseRoutingModule, SubheaderModule, CreateWarehouseModalModule, BreadcrumbModule],
})
export class WarehouseModule {}
