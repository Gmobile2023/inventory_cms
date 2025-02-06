import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTTTBLotsComponent } from './list-lots.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: ListTTTBLotsComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ListTTTBLotsRoutingModule { }
