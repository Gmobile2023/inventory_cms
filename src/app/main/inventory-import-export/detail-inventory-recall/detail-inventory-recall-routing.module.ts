import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailInventoryRecallComponent } from './detail-inventory-recall.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DetailInventoryRecallComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DetailInventoryRecallRoutingModule {}
