import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabViewModule } from 'primeng/tabview';
import { CreateInventoryRecallComponent } from './create-inventory-recall.component';
import { CreateInventoryRecallRoutingModule } from './create-inventory-recall-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    declarations: [CreateInventoryRecallComponent],
    imports: [
        AppSharedModule,
        CreateInventoryRecallRoutingModule,
        BreadcrumbModule,
        TabViewModule,
        FileUploadModule,
        ProgressSpinnerModule,
    ],
})
export class CreateInventoryRecallModule {}
