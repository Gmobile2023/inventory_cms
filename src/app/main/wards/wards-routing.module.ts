import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardsComponent } from './wards.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: WardsComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WardsRoutingModule {}
