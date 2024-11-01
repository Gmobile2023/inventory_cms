import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateWarehouseModalComponent } from './create-warehouse-modal.component';
import { AppSharedModule } from '@app/shared/app-shared.module';

@NgModule({
    imports: [AppSharedModule],
    declarations: [CreateWarehouseModalComponent],
    exports: [CreateWarehouseModalComponent],
})
export class CreateWarehouseModalModule {}
