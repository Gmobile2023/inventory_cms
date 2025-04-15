import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailInventoryComponent } from './detail-inventory.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DetailInventoryComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DetailInventoryRoutingModule {}
