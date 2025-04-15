import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimAssignmentsComponent } from './sim-assignments.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: SimAssignmentsComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SimAssignmentsRoutingModule {}
