import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInventoryExportComponent } from './create-inventory-export.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: CreateInventoryExportComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateInventoryExportRoutingModule {}
