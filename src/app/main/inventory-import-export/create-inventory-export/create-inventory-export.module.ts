import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { CreateInventoryExportComponent } from './create-inventory-export.component';
import { CreateInventoryExportRoutingModule } from './create-inventory-export-routing.module';
import { TagModule } from 'primeng/tag';

@NgModule({
    declarations: [CreateInventoryExportComponent],
    imports: [
        AppSharedModule,
        CreateInventoryExportRoutingModule,
        BreadcrumbModule,
        FileUploadModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
    ],
})
export class CreateInventoryExportModule {}
