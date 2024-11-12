import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CreateInventoryImportComponent } from './create-inventory-import.component';
import { CreateInventoryImportRoutingModule } from './create-inventory-import-routing.module';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
    declarations: [CreateInventoryImportComponent],
    imports: [
        AppSharedModule,
        CreateInventoryImportRoutingModule,
        BreadcrumbModule,
        FileUploadModule,
        ToastModule,
        ProgressBarModule,
    ],
})
export class CreateInventoryImportModule {}
