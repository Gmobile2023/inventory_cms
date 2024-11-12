import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DistrictsComponent } from './districts.component';
import { DistrictsRoutingModule } from './districts-routing.module';

@NgModule({
    declarations: [DistrictsComponent],
    imports: [AppSharedModule, DistrictsRoutingModule, BreadcrumbModule],
})
export class DistrictsModule {}
