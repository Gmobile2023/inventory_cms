import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalFlowSettingsComponent } from './approval-flow-settings.component';

const routes: Routes = [
    {
        path: '',
        children: [{ path: '', component: ApprovalFlowSettingsComponent }],
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ApprovalFlowSettingsRoutingModule {}
