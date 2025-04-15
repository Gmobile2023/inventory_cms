import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailInventoryImportComponent } from './detail-inventory-import.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DetailInventoryImportComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DetailInventoryImportRoutingModule {}
