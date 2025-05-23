import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabViewModule } from 'primeng/tabview';
import { DetailInventoryRecallComponent } from './detail-inventory-recall.component';
import { DetailInventoryRecallRoutingModule } from './detail-inventory-recall-routing.module';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [DetailInventoryRecallComponent],
    imports: [AppSharedModule, DetailInventoryRecallRoutingModule, BreadcrumbModule, TabViewModule, FileUploadModule],
})
export class DetailInventoryRecallModule {}
