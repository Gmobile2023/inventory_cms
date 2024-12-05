import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { CreateOrderDto, InventoryServiceProxy, IOrderItem, OrderItem } from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
@Component({
    templateUrl: './create-inventory-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryImportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy, private router: Router) {
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
    stockId: number;
    productType: number = 2;
    listStock = [];
    tempOrderItems: IOrderItem[] = [
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
        this.getListStock();
    }

    getListStock() {
        this._inventoryServiceProxy
            .getListStock(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                0,
                99
            )
            .subscribe((result) => {
                this.listStock = result.items;
            });
    }

    onChangeStock(event: Event) {
        const stockId = parseInt((event.target as HTMLSelectElement).value);
        this.stockId = stockId;
    }

    createOrder() {
        const body = new CreateOrderDto();
        body.title = this.title;
        body.description = this.description;
        body.stockId = this.stockId;
        body.productType = this.productType;
        // Convert IOrderItem[] to OrderItem[]
        if (this.tempOrderItems) {
            body.items = this.tempOrderItems.map((item) => {
                return OrderItem.fromJS(item); // Convert each IOrderItem to OrderItem
            });
        }
        // console.log(body);
        this._inventoryServiceProxy.createOrder(body).subscribe(() => {
            this.router.navigate(['/app/main/inventory-import-export']);
            this.notify.info(this.l('SavedSuccessfully'));
        });
    }

    addRow() {
        this.tempOrderItems.push({
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
        this.tempOrderItems.splice(index, 1);
    }

    onBasicUploadAuto(event) {
        console.log('Upload success');
    }

    onUpload(event) {}
}
