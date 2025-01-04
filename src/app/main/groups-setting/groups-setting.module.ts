import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { GroupsSettingComponent } from './groups-setting.component';
import { GroupsSettingRoutingModule } from './groups-setting-routing.module';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
    declarations: [GroupsSettingComponent],
    imports: [AppSharedModule, GroupsSettingRoutingModule, BreadcrumbModule, MultiSelectModule],
})
export class GroupsSettingModule {}
