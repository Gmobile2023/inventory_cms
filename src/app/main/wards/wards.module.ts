import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { WardsComponent } from './wards.component';
import { WardsRoutingModule } from './wards-routing.module';

@NgModule({
    declarations: [WardsComponent],
    imports: [AppSharedModule, WardsRoutingModule, BreadcrumbModule],
})
export class WardsModule {}
