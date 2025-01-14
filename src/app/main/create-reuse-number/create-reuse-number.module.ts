import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { CreateReuseNumberRoutingModule } from './create-reuse-number-routing.module';
import { CreateReuseNumberComponent } from './create-reuse-number.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    declarations: [CreateReuseNumberComponent],
    imports: [
        AppSharedModule,
        CreateReuseNumberRoutingModule,
        BreadcrumbModule,
        FileUploadModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        ProgressSpinnerModule,
    ],
})
export class CreateReuseNumberModule {}
