import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsSettingComponent } from './groups-setting.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: GroupsSettingComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GroupsSettingRoutingModule {}
