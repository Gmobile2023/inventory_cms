import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditInventoryModalComponent } from './edit-inventory-modal.component';
import { CreateInventoryModalComponent } from '@app/shared/common/create-inventory-modal/create-inventory-modal.component';
import { MenuItem } from 'primeng/api';

@Component({
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class InventoryComponent extends AppComponentBase implements OnInit {
    @ViewChild('createInventoryModal', { static: true }) createInventoryModal: CreateInventoryModalComponent;
    @ViewChild('editInventoryModal', { static: true }) editInventoryModal: EditInventoryModalComponent;

    constructor(injector: Injector) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;

    ngOnInit() {
        this.items = [{ label: 'Quản lý kho' }, { label: 'Danh sách kho' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    createWarehouse(): void {
        this.createInventoryModal.show();
    }

    editWarehouse(): void {
        this.editInventoryModal.show();
    }

    dataFake = [
        {
            id: 1,
            warehouseCode: 'G99_1',
            warehouseName: 'G99',
            productType: 'Sim vật lý',
            product: 'Gold',
            quantity: '5.000',
            warehouseChildren: '10',
            warehouseAddress: 'Hà Nội',
            status: 0,
            date: '26/10/2024 09:30',
        },
        {
            id: 2,
            warehouseCode: 'G99_2',
            warehouseName: 'G99',
            productType: 'Sim vật lý',
            product: 'Premium',
            quantity: '5.000',
            warehouseChildren: '10',
            warehouseAddress: 'Đà Nẵng',
            status: 1,
            date: '26/10/2024 09:30',
        },
        {
            id: 3,
            warehouseCode: 'G99_3',
            warehouseName: 'G99',
            productType: 'Sim vật lý',
            product: 'Premium',
            quantity: '5.000',
            warehouseChildren: '10',
            warehouseAddress: 'TP.Hồ Chí Minh',
            status: 2,
            date: '26/10/2024 09:30',
        },
    ];
}
