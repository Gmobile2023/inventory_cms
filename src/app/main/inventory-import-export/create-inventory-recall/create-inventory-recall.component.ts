import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
    CreateRecoveryDto,
    InventoryServiceProxy,
    IOrderItem,
    ObjectType,
    OrderItem,
    ProductType,
} from '@shared/service-proxies/service-proxies';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';

@Component({
    templateUrl: './create-inventory-recall.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryRecallComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy, private router: Router) {
        super(injector);
    }
    uploadedFiles: any[] = [];
    selectedRecords: [];
    items: MenuItem[];
    home: MenuItem;
    value: number = 0;
    selectedRecordsTo: any[] = [];
    selectedRecordsFrom: any[] = [];
    rowsPerPage = 10;
    currentPage = 0;
    currentDataFrom: any[] = [];
    listStock: any[] = [];
    title: string | undefined;
    description: string | undefined;
    srcStockId: number;
    desStockId: number;
    userCreated: string | undefined;
    productType: ProductType = ProductType.Mobile;
    objectType: ObjectType = ObjectType.All;
    rangeRule: OrderItem;
    rangeItems: string[] | undefined = [];
    isRangeRule: boolean = true;
    orderName: string = '';
    tempOrderItems: IOrderItem = {
        orderName: '',
        unit: '',
        attribute: '',
        telCo: '',
        fromRange: '',
        toRange: '',
        quantity: 0,
    };
    ProductType = ProductType;
    ObjectType = ObjectType;
    listSimSrcStock: any[] = [];
    stockId: number;
    isRecover: boolean | undefined = true;
    selectedStockFrom: any;
    selectedStockTo: any;
    productAttribute: any[] = [];
    simTypes: any[] = [];
    product: string;
    attribute: string;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu thu hồi về kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getListStock();
        this.getProductAttributes();
        this.getSimsTypes();
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

    getProductAttributes() {
        this._inventoryServiceProxy
            .getProductAttributes(this.productType.toString(), undefined, 0, 10)
            .subscribe((result) => {
                this.productAttribute = result.items;
            });
    }

    getSimsTypes() {
        this._inventoryServiceProxy.getSimsTypes(this.productType.toString(), undefined, 0, 10).subscribe((result) => {
            this.simTypes = result.items;
        });
    }

    onRangeRuleChange(event: Event) {
        this.isRangeRule = !this.isRangeRule;
    }

    onChangeProductType(event: Event) {
        this.productType = (event.target as HTMLSelectElement).value as unknown as ProductType;
        console.log(this.productType);
    }

    onChangeStock(event: { value: any }) {
        const stockId = event.value.id;
        this.stockId = stockId;
        this.getListSimsTransfers();
    }

    calculateQuantity(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không hợp lệ
        if (this.tempOrderItems.fromRange && this.tempOrderItems.toRange) {
            const from = parseInt(this.tempOrderItems.fromRange, 10);
            const to = parseInt(this.tempOrderItems.toRange, 10);

            if (!isNaN(from) && !isNaN(to) && to >= from) {
                this.tempOrderItems.quantity = to - from + 1; // Tính số lượng
            } else {
                this.tempOrderItems.quantity = 0; // Nếu giá trị không hợp lệ
            }
        } else {
            this.tempOrderItems.quantity = 0; // Nếu chưa nhập đủ
        }
    }

    onKeyPress(event: KeyboardEvent): void {
        const regex = /^[0-9]*$/; // Chỉ cho phép nhập số
        if (!regex.test(event.key)) {
            event.preventDefault(); // Chặn ký tự không hợp lệ
        }
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        input.value = input.value.replace(/[^0-9]/g, ''); // Loại bỏ ký tự không hợp lệ
    }

    getListSimsTransfers(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSimsTransfers(
                this.stockId,
                this.productType,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                this.isRecover,
                undefined,
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listSimSrcStock = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    createRecovery() {
        const body = new CreateRecoveryDto();
        body.title = this.title;
        body.description = this.description;
        body.srcStockId = this.selectedStockFrom.id;
        body.desStockId = this.selectedStockTo.id;
        body.productType = this.productType;
        body.objectType = this.objectType;
        if (this.isRangeRule) {
            body.rangeRule = OrderItem.fromJS(this.tempOrderItems);
        }
        if (this.currentDataFrom.length > 0) {
            const data = [];
            this.currentDataFrom.forEach((item) => {
                if (this.productType == 1) {
                    data.push(item.mobile);
                } else {
                    data.push(item.serial);
                }
            });
            body.rangeItems = data;
        }
        console.log(body);
        this._inventoryServiceProxy.createRecovery(body).subscribe(() => {
            this.router.navigate(['/app/main/inventory-import-export']);
            this.notify.info(this.l('SavedSuccessfully'));
        });
    }

    onPageFrom(event: any) {
        this.currentPage = event.page;
        this.updateCurrentDataFrom();
    }

    moveSelectedRecords() {
        const duplicateRecord = this.selectedRecordsTo.find((record) =>
            this.rangeItems.some((item) => JSON.stringify(item) === JSON.stringify(record))
        );

        if (duplicateRecord) {
            // Hiển thị thông báo lỗi cho bản ghi đầu tiên bị trùng
            if (this.productType === ProductType.Mobile) {
                this.message.error(`Bản ghi ${duplicateRecord.mobile} đã tồn tại`);
            } else {
                this.message.error(`Bản ghi ${duplicateRecord.serial} đã tồn tại`);
            }
        } else {
            // Không có bản ghi nào bị trùng, thêm tất cả vào rangeItems
            this.rangeItems.push(...this.selectedRecordsTo);
        }

        // Làm trống selectedRecordsTo sau khi xử lý
        this.selectedRecordsTo = [];
        this.updateCurrentDataFrom();
    }

    moveBackSelectedRecords() {
        // Di chuyển từng phần tử từ dataFakeFrom về dataFakeTo
        this.selectedRecordsFrom.forEach((record) => {
            const index = this.rangeItems.indexOf(record);
            if (index > -1) {
                this.rangeItems.splice(index, 1);
            }
        });
        this.selectedRecordsFrom = []; // Xóa danh sách các phần tử đã chọn
        this.updateCurrentDataFrom();
    }

    updateCurrentDataFrom() {
        const start = this.currentPage * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        this.currentDataFrom = this.rangeItems.slice(start, end);
    }

    onUpload(event) {}
}
