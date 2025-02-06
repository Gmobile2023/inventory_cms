import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { AddOrderRoutingModule } from './add-order-routing.module';
import { AddOrderComponent } from './add-order.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TimelineModule } from 'primeng/timeline';
import { StepsModule } from 'primeng/steps';
import { RadioButton } from 'primeng/radiobutton';
import { RadioButtonModule } from 'primeng/radiobutton';


@NgModule({
    declarations: [AddOrderComponent],
    imports: [
        AppSharedModule,
        AddOrderRoutingModule,
        BreadcrumbModule,
        FileUploadModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        ProgressSpinnerModule,
        TimelineModule,
        StepsModule, 
        RadioButtonModule
    ],
})
export class AddOrderModule { }
