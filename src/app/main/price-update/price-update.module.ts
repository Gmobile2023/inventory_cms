import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PriceUpdateComponent } from './price-update.component';
import { PriceUpdateRoutingModule } from './price-update-routing.module';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
    declarations: [PriceUpdateComponent],
    imports: [AppSharedModule, PriceUpdateRoutingModule, BreadcrumbModule, FileUploadModule],
})
export class PriceUpdateModule {}
