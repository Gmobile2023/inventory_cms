import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesComponent } from './countries.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: CountriesComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CountriesRoutingModule {}
