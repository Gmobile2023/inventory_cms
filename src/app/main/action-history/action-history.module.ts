import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ActionHistoryComponent } from './action-history.component';
import { ActionHistoryRoutingModule } from './action-history-routing.module';

@NgModule({
    declarations: [ActionHistoryComponent],
    imports: [AppSharedModule, ActionHistoryRoutingModule, BreadcrumbModule],
})
export class ActionHistoryModule {}
