import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { SubheaderModule } from '@app/shared/common/sub-header/subheader.module';
import { DetailInventoryRoutingModule } from './detail-inventory-routing.module';
import { DetailInventoryComponent } from './detail-inventory.component';
import { CreateInventoryModalModule } from '@app/shared/common/create-inventory-modal/create-inventory-modal.module';
import { SimDetailModalComponent } from './sim-detail-modal.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
    declarations: [DetailInventoryComponent, SimDetailModalComponent],
    imports: [
        AppSharedModule,
        DetailInventoryRoutingModule,
        SubheaderModule,
        CreateInventoryModalModule,
        BreadcrumbModule,
    ],
})
export class DetailInventoryModule {}
