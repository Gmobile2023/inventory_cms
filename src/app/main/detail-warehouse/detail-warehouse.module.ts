import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { SubheaderModule } from '@app/shared/common/sub-header/subheader.module';
import { DetailWarehouseRoutingModule } from './detail-warehouse-routing.module';
import { DetailWarehouseComponent } from './detail-warehouse.component';
import { CreateWarehouseModalModule } from '@app/shared/common/create-warehouse-modal/create-warehouse-modal.module';
import { SimDetailModalComponent } from './sim-detail-modal.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    declarations: [DetailWarehouseComponent, SimDetailModalComponent],
    imports: [
        AppSharedModule,
        DetailWarehouseRoutingModule,
        SubheaderModule,
        CreateWarehouseModalModule,
        BreadcrumbModule,
    ],
})
export class DetailWarehouseModule {}
