import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { SubheaderModule } from '@app/shared/common/sub-header/subheader.module';
import { DetailInventoryRoutingModule } from './detail-inventory-routing.module';
import { DetailInventoryComponent } from './detail-inventory.component';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    declarations: [DetailInventoryComponent],
    imports: [
        AppSharedModule,
        DetailInventoryRoutingModule,
        SubheaderModule,
        BreadcrumbModule,
        FileUploadModule,
        ProgressBarModule,
    ],
})
export class DetailInventoryModule {}
