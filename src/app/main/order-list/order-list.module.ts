import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { OrderListRoutingModule } from './order-list-routing.module';
import { OrderListComponent } from './order-list.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
    declarations: [OrderListComponent],
    imports: [
        AppSharedModule,
        OrderListRoutingModule,
        BreadcrumbModule,
        FileUploadModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        ProgressSpinnerModule,
    ],
})
export class OrderListModule { }
