import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmOrderDto, InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: './detail-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryExportComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('dataTable2', { static: true }) dataTable2: Table;
    @ViewChild('paginator2', { static: true }) paginator2: Paginator;
    @ViewChild('dataTable3', { static: true }) dataTable3: Table;
    @ViewChild('paginator3', { static: true }) paginator3: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private router: Router,
        private _fileDownloadService: FileDownloadService,
        private _httpClient: HttpClient
    ) {
        super(injector);
    }
    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    orderId: number;
    orderData: any = {};
    orderCode: string;
    listAction: any[] = [];
    listSim: any[] = [];
    listProduct: any[] = [];
    description: string;
    orderDataItems: any = {};
    mobile: string;
    serial: string;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    uploadedFiles: File[] = [];
    convertedUrl: string;
    userName: string = '';
    isAction: boolean = false;
    isAdmin: boolean = false;
    orderChildId: number;
    totalRecordsCount1: number;
    totalRecordsCount2: number;
    totalRecordsCount3: number;

    ngOnInit(): void {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Chi tiết yêu cầu xuất kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.orderId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.getStockForView();
        this.userName = this.appSession.user.userName;
    }

    getStockForView() {
        this._inventoryServiceProxy.getOrderForView(this.orderId, true).subscribe((result) => {
            this.orderData = result.order;
            this.orderDataItems = result.order.items[0];
            if (this.orderData.orderCode) {
                this.orderCode = this.orderData.orderCode;
                this.getActionHistory();
                this.getListSimOrderDetail();
            }
            if (this.orderData.document) this.convertUrl(this.orderData.document);
            if (this.orderData.settingUser) this.isAction = this.orderData.settingUser.includes(this.userName);
            if (this.orderData.settingUserStock) this.isAdmin = this.orderData.settingUserStock.includes(this.userName);
        });
    }

    getActionHistory(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getHistories(
                undefined,
                undefined,
                this.orderCode,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listAction = result.items;
                this.totalRecordsCount1 = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    getListSimOrderDetail(event?: LazyLoadEvent) {
        this._inventoryServiceProxy
            .getListSimOrderDetail(
                this.orderId,
                this.mobile,
                this.serial,
                this.primengTableHelper.getSorting(this.dataTable2),
                this.primengTableHelper.getSkipCount(this.paginator2, event),
                this.primengTableHelper.getMaxResultCount(this.paginator2, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listSim = result.items;
                this.totalRecordsCount2 = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    getSimPeriodDetail(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getSimPeriodDetail(
                this.orderChildId,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listProduct = result.items;
                this.totalRecordsCount3 = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    confirmOrder() {
        const body = new ConfirmOrderDto();
        body.orderCode = this.orderCode;
        if (this.orderData.status !== 5) {
            body.status = 2;
        } else {
            body.status = 1;
        }
        this._inventoryServiceProxy.confirmOrder(body).subscribe(() => {
            this.router.navigate(['/app/main/inventory-import-export']);
            this.notify.info(this.l('SavedSuccessfully'));
            this.closeModal();
        });
    }

    refuseOrder() {
        const body = new ConfirmOrderDto();
        body.orderCode = this.orderCode;
        body.description = this.description;
        body.status = 7;
        if (body.description) {
            this._inventoryServiceProxy.confirmOrder(body).subscribe(() => {
                this.router.navigate(['/app/main/inventory-import-export']);
                this.notify.info(this.l('SavedSuccessfully'));
                this.closeModal();
            });
        } else {
            this.message.error(this.l('Vui lòng nhập lý do từ chối'));
        }
    }

    exportToExcel(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSimOrderToExcel(this.orderId, undefined, undefined)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    onFileSelect(event: any): void {
        if (event.files && event.files.length > 0) {
            this.uploadedFiles.push(...event.files); // Lưu tệp vào mảng
        }
    }

    onSubmitUpload() {
        this.uploadOrderDocument(this.orderData.orderCode, this.uploadedFiles);
    }

    convertUrl(url: string): void {
        const parts = url.split('/');
        const fileName = parts.pop(); // Lấy phần tên file cuối
        const hiddenPath = '******';
        this.convertedUrl = `${hiddenPath}/${fileName}`;
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
                    this.getStockForView();
                    this.closeModal();
                    this.notify.success(this.l('Tải file chứng từ thành công'));
                }
            },
            error: (err) => {
                this.message.error(this.l(err.error.error?.message));
            },
        });
    }

    openFormViewSim(template: TemplateRef<any>, idOrder: number) {
        if (idOrder) {
            this.orderChildId = idOrder;
            this.getSimPeriodDetail();
        }
        setTimeout(() => {
            this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-xl' });
        }, 200);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
        this.listProduct = [];
    }
}
