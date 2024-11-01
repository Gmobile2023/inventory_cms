import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryReportComponent } from './inventory-report.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: InventoryReportComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InventoryReportRoutingModule {}
