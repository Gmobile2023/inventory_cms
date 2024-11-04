import { Component, Injector, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { SimDetailModalComponent } from './sim-detail-modal.component';
import { MenuItem } from 'primeng/api';
import { CreateInventoryModalComponent } from '@app/shared/common/create-inventory-modal/create-inventory-modal.component';

@Component({
    templateUrl: './detail-inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryComponent extends AppComponentBase {
    @ViewChild('createInventoryModal', { static: true }) createInventoryModal: CreateInventoryModalComponent;
    @ViewChild('simDetailModal', { static: true }) simDetailModal: SimDetailModalComponent;

    constructor(injector: Injector) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Danh sách kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Chi tiết kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    createWarehouse(): void {
        this.createInventoryModal.show();
    }

    getSimDetail(): void {
        this.simDetailModal.show();
    }

    dataFake = [
        {
            id: 1,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'VINAPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 0,
            date: '26/10/2024 09:30',
        },
        {
            id: 2,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'MOBIPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 1,
            date: '26/10/2024 09:30',
        },
        {
            id: 3,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'VINAPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 0,
            date: '26/10/2024 09:30',
        },
        {
            id: 4,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'MOBIPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 1,
            date: '26/10/2024 09:30',
        },
    ];
}
