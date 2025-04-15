import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailReuseNumberComponent } from './detail-reuse-number.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: DetailReuseNumberComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DetailReuseNumberRoutingModule {}
