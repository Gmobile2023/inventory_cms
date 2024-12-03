import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { CreateOrderDto, InventoryServiceProxy, IOrderItem } from '@shared/service-proxies/service-proxies';
@Component({
    templateUrl: './create-inventory-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryImportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy) {
        super(injector);
    }

    uploadedFiles: any[] = [];
    items: MenuItem[];
    home: MenuItem;
    dataFake = [{ id: 1 }];
    indexData: number = 1;
    value: number = 0;
    title: string | undefined;
    description: string | undefined;
    stockId: number = 38;
    productType: number = 2;
    orderItems: any[] = [
        {
            orderName: '',
            unit: '',
            attribute: '',
            telCo: '',
            fromRange: '',
            toRange: '',
            quantity: 0,
        },
    ];

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu nhập kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        let interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 0;
            }
        }, 2000);
    }

    createOrder() {
        const body = new CreateOrderDto();
        body.title = this.title;
        body.description = this.description;
        body.stockId = this.stockId;
        body.productType = this.productType;
        // body.userCreated = 'tienbv';
        body.items = this.orderItems;
        // console.log(body);
        this._inventoryServiceProxy.createOrder(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
        });
    }

    addRow() {
        this.orderItems.push({
            orderName: '',
            unit: '',
            attribute: '',
            telCo: '',
            fromRange: '',
            toRange: '',
            quantity: 0,
        });
    }

    removeRow(index: number): void {
        this.orderItems.splice(index, 1);
    }

    onBasicUploadAuto(event) {
        console.log('Upload success');
    }

    onUpload(event) {}
}
