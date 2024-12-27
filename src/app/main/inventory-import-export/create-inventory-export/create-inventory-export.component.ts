import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
    CreateTransferDto,
    InventoryServiceProxy,
    IOrderItem,
    ObjectType,
    OrderItem,
    ProductType,
} from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({
    templateUrl: './create-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryExportComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy, private router: Router) {
        super(injector);
    }
    uploadedFiles: any[] = [];
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
    selectedStockFrom: any;
    selectedStockTo: any;
    productAttribute: any[] = [];
    simTypes: any[] = [];
    product: string;
    attribute: string;
    isAllChecked: boolean = false;
    simType: string;
    fromRange: string;
    toRange: string;
    mobile: string;
    serial: string;
    expectedQuantity: number;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu xuất kho' },
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

    onRangeRuleChange(event: Event) {
        this.isRangeRule = !this.isRangeRule;
        if (!this.isRangeRule) {
            this.objectType = ObjectType.List;
        } else {
            this.objectType = ObjectType.All;
        }
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

    onChangeProductType(event: Event) {
        this.productType = (event.target as HTMLSelectElement).value as unknown as ProductType;
        this.getProductAttributes();
        this.getSimsTypes();
        if (this.stockId) {
            this.getListSimSrcStock();
        }
    }

    onChangeStock(event: { value: any }) {
        const stockId = event.value.id;
        this.stockId = stockId;
        this.getListSimSrcStock();
    }

    getListSimSrcStock(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSimsTransfers(
                this.stockId,
                this.productType,
                this.attribute,
                this.productType === ProductType.Mobile ? this.product : undefined,
                this.productType === ProductType.Serial ? this.product : undefined,
                this.simType,
                undefined,
                this.fromRange,
                this.toRange,
                false,
                undefined,
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listSimSrcStock = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
                this.isAllChecked = false;
            });
    }

    calculateQuantity(): void {
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

    createTransfer() {
        const body = new CreateTransferDto();
        body.title = this.title;
        body.description = this.description;
        if (this.selectedStockFrom) body.srcStockId = this.selectedStockFrom.id;
        if (this.selectedStockTo) body.desStockId = this.selectedStockTo.id;
        body.productType = this.productType;
        body.objectType = this.objectType;
        body.expectedQuantity = this.expectedQuantity;
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
        // console.log(body);
        this._inventoryServiceProxy.createTransfer(body).subscribe(() => {
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

    onHeaderCheckboxToggle(event: { checked: boolean }): void {
        if (event.checked) {
            // Chỉ chọn những item không bị disabled
            this.selectedRecordsTo = this.listSimSrcStock.filter(
                (record) => !this.isRecordInTable2(record) && !this.isRangeRule
            );
        } else {
            // Bỏ chọn tất cả
            this.selectedRecordsTo = [];
        }
    }

    isRecordInTable2(record: any): boolean {
        return this.currentDataFrom.some((item) => JSON.stringify(item) === JSON.stringify(record));
    }

    onUpload(event) {}
}
