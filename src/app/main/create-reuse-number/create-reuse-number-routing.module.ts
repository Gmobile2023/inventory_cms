import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReuseNumberComponent } from './create-reuse-number.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: CreateReuseNumberComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CreateReuseNumberRoutingModule {}
