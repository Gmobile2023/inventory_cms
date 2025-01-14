import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReuseNumberComponent } from './reuse-number.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: ReuseNumberComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReuseNumberRoutingModule {}
