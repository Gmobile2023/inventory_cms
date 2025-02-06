import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RegistrationTTTBComponent } from './dktttb.component';
import { RegistrationTTTBRoutingModule } from './dktttb-routing.module';

@NgModule({
    declarations: [RegistrationTTTBComponent],
    imports: [AppSharedModule, RegistrationTTTBRoutingModule, BreadcrumbModule],
})
export class RegistrationTTTBModule { }
