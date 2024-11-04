import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryImportExportComponent } from './inventory-import-export.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: InventoryImportExportComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InventoryImportExportRoutingModule {}
