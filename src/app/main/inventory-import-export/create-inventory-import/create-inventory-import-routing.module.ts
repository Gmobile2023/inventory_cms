import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInventoryImportComponent } from './create-inventory-import.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: CreateInventoryImportComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateInventoryImportRoutingModule {}
