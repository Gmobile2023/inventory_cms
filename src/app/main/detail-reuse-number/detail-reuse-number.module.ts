import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { DetailReuseNumberComponent } from './detail-reuse-number.component';
import { DetailReuseNumberRoutingModule } from './detail-reuse-number-routing.module';

@NgModule({
    declarations: [DetailReuseNumberComponent],
    imports: [AppSharedModule, DetailReuseNumberRoutingModule, BreadcrumbModule, TabViewModule, FileUploadModule],
})
export class DetailReuseNumberModule {}
