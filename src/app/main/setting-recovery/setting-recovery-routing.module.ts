import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingRecoveryComponent } from './setting-recovery.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: SettingRecoveryComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingRecoveryRoutingModule {}
