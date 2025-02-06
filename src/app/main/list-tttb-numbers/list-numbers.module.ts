import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ListTTTBNumbersComponent } from './list-numbers.component';
import { ListTTTBNumbersRoutingModule } from './list-numbers-routing.module';

@NgModule({
    declarations: [ListTTTBNumbersComponent],
    imports: [AppSharedModule, ListTTTBNumbersRoutingModule, BreadcrumbModule],
})
export class ListTTTBNumbersModule { }
