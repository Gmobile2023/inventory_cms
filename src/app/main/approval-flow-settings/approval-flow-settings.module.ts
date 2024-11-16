import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApprovalFlowSettingsComponent } from './approval-flow-settings.component';
import { ApprovalFlowSettingsRoutingModule } from './approval-flow-settings-routing.module';

@NgModule({
    declarations: [ApprovalFlowSettingsComponent],
    imports: [AppSharedModule, ApprovalFlowSettingsRoutingModule, BreadcrumbModule],
})
export class ApprovalFlowSettingsModule {}
