import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionHistoryComponent } from './action-history.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: ActionHistoryComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ActionHistoryRoutingModule {}
