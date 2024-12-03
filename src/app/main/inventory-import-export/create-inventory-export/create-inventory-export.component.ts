import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
    CreateTransferDto,
    InventoryServiceProxy,
    ObjectType,
    OrderItem,
    ProductType,
} from '@shared/service-proxies/service-proxies';
@Component({
    templateUrl: './create-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryExportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy) {
        super(injector);
    }
    uploadedFiles: any[] = [];
    items: MenuItem[];
    home: MenuItem;
    value: number = 0;
    selectedRecords: [];
    dataFakeTo = [
        {
            id: 1,
            loai: '898407210016823000',
            ma: 'GOLD',
            ten: '1.000.000',
            donvi: 'VINAPHONE',
        },
        {
            id: 2,
            loai: '898407210016823000',
            ma: 'SILVER',
            ten: '2.000.000',
            donvi: 'VIETTEL',
        },
        {
            id: 3,
            loai: '898407210016823000',
            ma: 'PREMIUM',
            ten: '3.000.000',
            donvi: 'MOBIPHONE',
        },
        {
            id: 4,
            loai: '898407210016823000',
            ma: 'GOLD',
            ten: '4.000.000',
            donvi: 'VINAPHONE',
        },
        {
            id: 5,
            loai: '898407210016823000',
            ma: 'SILVER',
            ten: '5.000.000',
            donvi: 'VIETTEL',
        },
        {
            id: 6,
            loai: '898407210016823000',
            ma: 'PREMIUM',
            ten: '6.000.000',
            donvi: 'MOBIPHONE',
        },
    ];
    dataFakeFrom: any[] = [];
    currentData: any[] = [];
    rowsPerPage = 5;
    currentPage = 0;
    currentDataFrom: any[] = [];
    listStock: any[] = [];
    title: string | undefined;
    description: string | undefined;
    srcStockId: number;
    desStockId: number;
    userCreated: string | undefined;
    productType: ProductType = 1;
    objectType: ObjectType = 1;
    // rangeRule: OrderItem;
    rangeItems: string[] | undefined;
    isRangeRule: boolean = true;
    rangeRule: any = {
        orderName: '',
        unit: '',
        attribute: '',
        telCo: '',
        fromRange: '',
        toRange: '',
        quantity: 0,
    };

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu xuất kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        let interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 0;
            }
        }, 2000);
        this.currentData = this.dataFakeTo.slice(0, this.rowsPerPage);
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

    onRangeRuleChange(event: Event) {
        this.isRangeRule = !this.isRangeRule;
        // if (this.isRangeRule) {
        //     this.rangeItems = undefined;
        //     this.rangeRule = new OrderItem();
        // }
    }

    calculateQuantity(): void {
        if (this.rangeRule.fromRange && this.rangeRule.toRange) {
            const from = parseInt(this.rangeRule.fromRange, 10);
            const to = parseInt(this.rangeRule.toRange, 10);

            if (!isNaN(from) && !isNaN(to) && to >= from) {
                this.rangeRule.quantity = to - from + 1; // Tính số lượng
            } else {
                this.rangeRule.quantity = 0; // Nếu giá trị không hợp lệ
            }
        } else {
            this.rangeRule.quantity = 0; // Nếu chưa nhập đủ
        }
    }

    createTransfer() {
        const body = new CreateTransferDto();
        body.title = this.title;
        body.description = this.description;
        body.srcStockId = this.srcStockId;
        body.desStockId = this.desStockId;
        body.productType = this.productType;
        body.objectType = this.objectType;
        body.rangeRule = this.rangeRule;
        console.log(body);
        this._inventoryServiceProxy.createTransfer(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
        });
    }

    onPage(event: any) {
        this.currentPage = event.page;
        this.updateCurrentData();
    }

    onPageFrom(event: any) {
        this.currentPage = event.page;
        this.updateCurrentDataFrom();
    }

    moveSelectedRecords() {
        this.selectedRecords.forEach((record) => {
            const index = this.dataFakeTo.indexOf(record);
            if (index > -1) {
                this.dataFakeTo.splice(index, 1); // Xóa phần tử khỏi dataFakeTo
                this.dataFakeFrom.push(record); // Thêm phần tử vào dataFakeFrom
            }
        });
        this.selectedRecords = []; // Reset lại selectedRecords
        this.updateCurrentData(); // Cập nhật lại currentData sau khi di chuyển
        this.updateCurrentDataFrom();
    }

    moveBackSelectedRecords() {
        // Di chuyển từng phần tử từ dataFakeFrom về dataFakeTo
        this.selectedRecords.forEach((record) => {
            const index = this.dataFakeFrom.indexOf(record);
            if (index > -1) {
                this.dataFakeFrom.splice(index, 1); // Xóa phần tử khỏi dataFakeFrom
                this.dataFakeTo.push(record); // Thêm phần tử vào dataFakeTo
            }
        });
        this.selectedRecords = []; // Xóa danh sách các phần tử đã chọn
        this.updateCurrentData(); // Cập nhật lại currentData cho phân trang
        this.updateCurrentDataFrom();
    }

    updateCurrentData() {
        const start = this.currentPage * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        this.currentData = this.dataFakeTo.slice(start, end); // Cập nhật currentData theo phân trang
    }
    updateCurrentDataFrom() {
        const start = this.currentPage * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        this.currentDataFrom = this.dataFakeFrom.slice(start, end); // Cập nhật dữ liệu của bảng thứ 2 theo phân trang
    }

    onUpload(event) {}
}
