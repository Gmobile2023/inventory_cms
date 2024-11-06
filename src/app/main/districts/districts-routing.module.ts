import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistrictsComponent } from './districts.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DistrictsComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DistrictsRoutingModule {}
