import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';

@Component({
    templateUrl: './action-history.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class ActionHistoryComponent extends AppComponentBase {
    constructor(injector: Injector) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/warehouse-manager' },
            { label: 'Lịch sử thao tác' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    dataFake = [
        {
            id: 1,
            warehouseCode: 'G99',
            warehouseName: 'Kho chiến sĩ G99',
            shipment: '0122AA3',
            shipmentName: 'G99',
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            content: 'Xuất từ kho tổng_Tới kho G99',
            operator: 'quanlykho@gmobile.com',
            date: '26/10/2024 09:30',
        },
        {
            id: 2,
            warehouseCode: 'G99',
            warehouseName: 'Kho chiến sĩ G99',
            shipment: '0122AA3',
            shipmentName: 'G99',
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            content: 'Xuất từ kho tổng_Tới kho G99',
            operator: 'quanlykho@gmobile.com',
            date: '26/10/2024 09:30',
        },
        {
            id: 3,
            warehouseCode: 'G99',
            warehouseName: 'Kho chiến sĩ G99',
            shipment: '0122AA3',
            shipmentName: 'G99',
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            content: 'Xuất từ kho tổng_Tới kho G99',
            operator: 'quanlykho@gmobile.com',
            date: '26/10/2024 09:30',
        },
    ];
}
