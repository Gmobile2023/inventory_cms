import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateInventoryModalComponent } from './create-inventory-modal.component';
import { AppSharedModule } from '@app/shared/app-shared.module';

@NgModule({
    imports: [AppSharedModule],
    declarations: [CreateInventoryModalComponent],
    exports: [CreateInventoryModalComponent],
})
export class CreateInventoryModalModule {}
