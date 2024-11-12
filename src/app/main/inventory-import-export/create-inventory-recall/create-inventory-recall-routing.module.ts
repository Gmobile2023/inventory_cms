import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInventoryRecallComponent } from './create-inventory-recall.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: CreateInventoryRecallComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateInventoryRecallRoutingModule {}
