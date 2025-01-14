import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SettingRecoveryComponent } from './setting-recovery.component';
import { SettingRecoveryRoutingModule } from './setting-recovery-routing.module';

@NgModule({
    declarations: [SettingRecoveryComponent],
    imports: [AppSharedModule, SettingRecoveryRoutingModule, BreadcrumbModule],
})
export class SettingRecoveryModule {}
