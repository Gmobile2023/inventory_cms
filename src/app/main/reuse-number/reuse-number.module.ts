import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ReuseNumberComponent } from './reuse-number.component';
import { ReuseNumberRoutingModule } from './reuse-number-routing.module';

@NgModule({
    declarations: [ReuseNumberComponent],
    imports: [AppSharedModule, ReuseNumberRoutingModule, BreadcrumbModule],
})
export class ReuseNumberModule {}
