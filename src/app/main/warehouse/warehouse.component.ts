import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { EditWarehouseModalComponent } from './edit-warehouse-modal.component';
import { CreateWarehouseModalComponent } from '@app/shared/common/create-warehouse-modal/create-warehouse-modal.component';
import { MenuItem } from 'primeng/api';

@Component({
    templateUrl: './warehouse.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class WarehouseComponent extends AppComponentBase implements OnInit {
    @ViewChild('createWarehouseModal', { static: true }) createWarehouseModal: CreateWarehouseModalComponent;
    @ViewChild('editWarehouseModal', { static: true }) editWarehouseModal: EditWarehouseModalComponent;

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
        this.createWarehouseModal.show();
    }

    editWarehouse(): void {
        this.editWarehouseModal.show();
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
