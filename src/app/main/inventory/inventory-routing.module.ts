import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: InventoryComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InventoryRoutingModule {}
