import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailInventoryExportComponent } from './detail-inventory-export.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DetailInventoryExportComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DetailInventoryExportRoutingModule {}
