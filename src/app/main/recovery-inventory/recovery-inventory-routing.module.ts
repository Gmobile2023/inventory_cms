import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecoveryInventoryComponent } from './recovery-inventory.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: RecoveryInventoryComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RecoveryInventoryRoutingModule {}
