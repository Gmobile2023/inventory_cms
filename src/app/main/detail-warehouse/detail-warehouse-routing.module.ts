import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailWarehouseComponent } from './detail-warehouse.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DetailWarehouseComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DetailWarehouseRoutingModule {}
