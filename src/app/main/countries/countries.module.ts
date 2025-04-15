import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CountriesComponent } from './countries.component';
import { CountriesRoutingModule } from './countries-routing.module';

@NgModule({
    declarations: [CountriesComponent],
    imports: [AppSharedModule, CountriesRoutingModule, BreadcrumbModule],
})
export class CountriesModule {}
