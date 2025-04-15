import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CitiesComponent } from './cities.component';
import { CitiesRoutingModule } from './cities-routing.module';

@NgModule({
    declarations: [CitiesComponent],
    imports: [AppSharedModule, CitiesRoutingModule, BreadcrumbModule],
})
export class CitiesModule {}
