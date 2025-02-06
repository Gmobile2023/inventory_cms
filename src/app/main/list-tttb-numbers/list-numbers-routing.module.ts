import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTTTBNumbersComponent } from './list-numbers.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: ListTTTBNumbersComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ListTTTBNumbersRoutingModule { }
