import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SimAssignmentsComponent } from './sim-assignments.component';
import { SimAssignmentsRoutingModule } from './sim-assignments-routing.module';

@NgModule({
    declarations: [SimAssignmentsComponent],
    imports: [
        AppSharedModule,
        SimAssignmentsRoutingModule,
        BreadcrumbModule,
        FileUploadModule,
        ToastModule,
        ProgressBarModule,
        TagModule,
        ProgressSpinnerModule,
    ],
})
export class SimAssignmentsModule {}
