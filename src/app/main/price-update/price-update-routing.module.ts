import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PriceUpdateComponent } from './price-update.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: PriceUpdateComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PriceUpdateRoutingModule {}
