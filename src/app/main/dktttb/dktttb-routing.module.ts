import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationTTTBComponent } from './dktttb.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: RegistrationTTTBComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RegistrationTTTBRoutingModule { }
