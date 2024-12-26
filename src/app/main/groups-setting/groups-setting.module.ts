import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { GroupsSettingComponent } from './groups-setting.component';
import { GroupsSettingRoutingModule } from './groups-setting-routing.module';

@NgModule({
    declarations: [GroupsSettingComponent],
    imports: [AppSharedModule, GroupsSettingRoutingModule, BreadcrumbModule],
})
export class GroupsSettingModule {}
