import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
    CreateTransferDto,
    InventoryServiceProxy,
    IOrderExportItemDto,
    IOrderItem,
    ObjectType,
    OrderExportDto,
    OrderExportItemDto,
    OrderItem,
    ProductType,
} from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient } from '@angular/common/http';
@Component({
    templateUrl: './create-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryExportComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private router: Router,
        private _httpClient: HttpClient,
        private route: ActivatedRoute
    ) {
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
    rangeItems: any[] = [];
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
    orderItems: IOrderExportItemDto = {
        items: [],
        fromRange: '',
        toRange: '',
        quantity: 0,
        productType: ProductType.Mobile,
    };
    ProductType = ProductType;
    ObjectType = ObjectType;
    listSimSrcStock: any[] = [];
    stockId: number;
    stockIdParam: number = null;
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
    orderData: any = {};

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu xuất kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getListStock();
        if (this.route.snapshot.queryParamMap.get('id')!) {
            this.stockIdParam = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        }
        if (this.stockIdParam) {
            setTimeout(() => {
                this.getOrderForView(this.stockIdParam);
            }, 100);
        }
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

    getOrderForView(id: number) {
        this._inventoryServiceProxy.getOrderForView(id).subscribe((result) => {
            this.orderData = result.order;
            this.selectedStockTo = this.listStock.find((stock) => stock.stockCode === this.orderData.desStockCode);
            this.selectedStockFrom = this.listStock.find((stock) => stock.stockCode === this.orderData.srcStockCode);
            this.getOrderPendingSims();
            if (this.orderData.items[0].categoryCode === 'MOBILE') {
                this.productType = ProductType.Mobile;
            } else {
                this.productType = ProductType.Serial;
            }
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

    getOrderPendingSims(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getOrderPendingSims(
                this.selectedStockFrom?.id,
                this.orderData.orderCode,
                this.productType,
                this.productType === ProductType.Mobile ? this.product : undefined,
                this.productType === ProductType.Serial ? this.product : undefined,
                undefined,
                undefined,
                this.simType,
                this.fromRange,
                this.toRange,
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
        this.isLoading = true;
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
        if (this.rangeItems.length > 0) {
            const data = [];
            this.rangeItems.forEach((item) => {
                if (this.productType == 1) {
                    data.push(item.mobile);
                } else {
                    data.push(item.serial);
                }
            });
            body.rangeItems = data;
        }

        if (this.uploadedFile) {
            // this._inventoryServiceProxy.createTransfer(body).subscribe({
            //     next: (response) => {
            //         if (response.success) {
            //             this.notify.info(this.l('SavedSuccessfully'));
            //             this.isLoading = false;
            //             this.closeModal();
            //             this.getListSims();
            //             this.selectedRecords = [];
            //             this.valuePrice = 0;
            //         }
            //     },
            //     error: (err) => {
            //         this.message.error(this.l(err.error.error?.message));
            //         this.isLoading = false;
            //     },
            // });
            this._inventoryServiceProxy.createTransfer(body).subscribe((result) => {
                this.isLoading = false;
                if (result.results.orderCode) {
                    this.uploadOrderDocument(result.results.orderCode, this.uploadedFile);
                }
            });
        } else {
            this.isLoading = false;
            this.message.error(this.l('Vui lòng tải lên thông tin chứng từ!'));
        }
    }

    createOrderExport() {
        this.isLoading = true;
        const body = new OrderExportDto();
        body.description = this.description;
        body.orderCode = this.orderData.orderCode;
        body.exportItems = [];
        body.exportItems.push(OrderExportItemDto.fromJS(this.orderItems));
        if (this.rangeItems.length > 0) {
            const data = [];
            this.rangeItems.forEach((item) => {
                if (this.productType == 1) {
                    data.push(item.mobile);
                } else {
                    data.push(item.serial);
                }
            });
            body.exportItems[0].items = data;
        }
        body.exportItems[0].quantity = this.tempOrderItems.quantity;
        body.exportItems[0].productType = this.productType;
        if (this.tempOrderItems.fromRange) body.exportItems[0].fromRange = this.tempOrderItems.fromRange;
        if (this.tempOrderItems.toRange) body.exportItems[0].toRange = this.tempOrderItems.toRange;

        this._inventoryServiceProxy.orderExport(body).subscribe(() => {
            this.router.navigate(['/app/main/inventory-import-export/detail-inventory-export'], {
                queryParams: { id: this.orderData.id },
            });
            this.notify.info(this.l('Xuất kho thành công!'));
        });
    }

    onFileSelect(event: any): void {
        const file = event.files && event.files[0];
        if (file) {
            this.uploadedFile = file;
        }
    }

    uploadOrderDocument(orderCode: string, file: File) {
        const uploadUrl = `${this.remoteServiceBaseUrl}/api/services/app/Inventory/UploadOrderDocument`;
        const formData = new FormData();
        formData.append('orderCode', orderCode);
        formData.append('file', file);
        this._httpClient.post<any>(uploadUrl, formData).subscribe({
            next: (response) => {
                if (response.success) {
                    this.router.navigate(['/app/main/inventory-import-export']);
                    this.notify.info(this.l('Tạo yêu cầu xuất kho thành công!'));
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

    onUpload(event) {}
}
