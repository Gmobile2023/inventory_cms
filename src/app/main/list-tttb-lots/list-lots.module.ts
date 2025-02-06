import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ListTTTBLotsComponent } from './list-lots.component';
import { ListTTTBLotsRoutingModule } from './list-lots-routing.module';

@NgModule({
    declarations: [ListTTTBLotsComponent],
    imports: [AppSharedModule, ListTTTBLotsRoutingModule, BreadcrumbModule],
})
export class ListTTTBLotsModule { }
