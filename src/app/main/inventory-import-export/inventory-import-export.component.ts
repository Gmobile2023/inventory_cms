import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';

@Component({
    templateUrl: './inventory-import-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class InventoryImportExportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;

    ngOnInit() {
        this.items = [{ label: 'Quản lý kho', routerLink: '/app/main/warehouse-manager' }, { label: 'Xuất/Nhập kho' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    dataFake = [
        {
            id: 1,
            title: 'Nhập kho Sim lô 10k sim hợp tác Vinaphone',
            requestType: 'Nhập kho',
            sentDate: '12/10/2024 14:30',
            approveDate: '20/10/2024 14:30',
            expectedQuantity: '5000',
            realityQuantity: '3000',
            status: 0,
        },
        {
            id: 2,
            title: 'Nhập kho Sim lô 10k sim hợp tác Vinaphone',
            requestType: 'Nhập kho',
            sentDate: '12/10/2024 14:30',
            approveDate: '20/10/2024 14:30',
            expectedQuantity: '5000',
            realityQuantity: '3000',
            status: 1,
        },
        {
            id: 3,
            title: 'Nhập kho Sim lô 10k sim hợp tác Vinaphone',
            requestType: 'Nhập kho',
            sentDate: '12/10/2024 14:30',
            approveDate: '20/10/2024 14:30',
            expectedQuantity: '5000',
            realityQuantity: '3000',
            status: 2,
        },
    ];
}
