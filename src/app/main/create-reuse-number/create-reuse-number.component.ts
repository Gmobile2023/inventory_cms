import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
    CreateSimRecallDto,
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
import { AppConsts } from '@shared/AppConsts';
import { HttpClient } from '@angular/common/http';
@Component({
    templateUrl: './create-reuse-number.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateReuseNumberComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private router: Router,
        private _httpClient: HttpClient
    ) {
        super(injector);
    }
    uploadedFiles: File[] = [];
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
    rangeItems: any[] = [];
    isRangeRule: boolean = true;
    orderName: string = '';
    tempOrderItems: IOrderItem = {
        orderName: '',
        unit: '',
        attribute: '',
        format: '',
        simType: '',
        telCo: '',
        fromRange: '',
        toRange: '',
        quantity: 0,
        items: [],
        productType: ProductType.Mobile,
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
    uploadedFile: File | null = null;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    isLoading: boolean = false;
    telCo: string;
    batchCode: string;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Quản lý kho thu hồi' },
            { label: 'Tạo mới yêu cầu tái sử dụng số' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getListStock();
        // this.getListSimSrcStock();
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
                this.selectedStockFrom = this.listStock.find((stock) => stock.id == 127);
            });
    }

    getSimsTypes() {
        this._inventoryServiceProxy.getSimsTypes(this.productType.toString(), undefined, 0, 10).subscribe((result) => {
            this.simTypes = result.items;
        });
    }

    getListSimSrcStock(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSuggestSimRecalls(
                this.mobile,
                this.telCo,
                this.batchCode,
                this.fromRange,
                this.toRange,
                this.primengTableHelper.getSorting(this.dataTable),
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

    createTransfer() {
        this.isLoading = true;
        const body = new CreateSimRecallDto();
        body.title = this.title;
        body.description = this.description;
        if (this.selectedStockTo) body.desStockId = this.selectedStockTo.id;
        if (this.rangeItems.length > 0) {
            const data = [];
            this.rangeItems.forEach((item) => {
                if (this.productType == 1) {
                    data.push(item.mobile);
                } else {
                    data.push(item.serial);
                }
            });
            body.items = data;
        }
        if (this.uploadedFiles.length > 0) {
            this._inventoryServiceProxy.createSimRecall(body).subscribe({
                next: (result) => {
                    this.isLoading = false;
                    if (result.results.orderCode) {
                        this.uploadOrderDocument(result.results.orderCode, this.uploadedFiles);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                },
            });
        } else {
            this.isLoading = false;
            this.message.error(this.l('Vui lòng tải lên thông tin chứng từ!'));
        }
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedFiles.push(...event.files); // Lưu tệp vào mảng
        }
    }

    uploadOrderDocument(orderCode: string, files: File[]) {
        const uploadUrl = `${this.remoteServiceBaseUrl}/api/services/app/Inventory/UploadOrderDocument`;
        const formData = new FormData();
        formData.append('orderCode', orderCode);
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });
        this._httpClient.post<any>(uploadUrl, formData).subscribe({
            next: (response) => {
                if (response.success) {
                    this.router.navigate(['/app/main/reuse-number']);
                    this.notify.info(this.l('Tạo yêu cầu thành công!'));
                }
            },
            error: (err) => {
                this.message.error(this.l(err.error.error?.message));
            },
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
}
