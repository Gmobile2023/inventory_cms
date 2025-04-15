import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RecoveryInventoryComponent } from './recovery-inventory.component';
import { RecoveryInventoryRoutingModule } from './recovery-inventory-routing.module';

@NgModule({
    declarations: [RecoveryInventoryComponent],
    imports: [AppSharedModule, RecoveryInventoryRoutingModule, BreadcrumbModule],
})
export class RecoveryInventoryModule {}
