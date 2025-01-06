import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmOrderDto, InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { AppConsts } from '@shared/AppConsts';
import { HttpClient } from '@angular/common/http';

@Component({
    templateUrl: './detail-inventory-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryImportComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private router: Router,
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
    listItem: any[] = [];
    description: string;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;
    uploadedFile: File | null = null;
    convertedUrl: string;
    isAction: boolean = false;
    isAdmin: boolean = false;
    userName: string = '';

    ngOnInit(): void {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Chi tiết yêu cầu nhập kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.orderId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.userName = this.appSession.user.userName;
        this.getStockForView();
    }

    getStockForView() {
        this._inventoryServiceProxy.getOrderForView(this.orderId).subscribe((result) => {
            this.orderData = result.order;
            if (this.orderData.orderCode) {
                this.orderCode = this.orderData.orderCode;
                this.getActionHistory();
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
                this.primengTableHelper.totalRecordsCount = result.totalCount;
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

    onFileSelect(event: any): void {
        const file = event.files && event.files[0];
        if (file) {
            this.uploadedFile = file;
        }
    }

    onSubmitUpload() {
        this.uploadOrderDocument(this.orderData.orderCode, this.uploadedFile);
    }

    convertUrl(url: string): void {
        const parts = url.split('/');
        const fileName = parts.pop(); // Lấy phần tên file cuối
        const hiddenPath = '******';
        this.convertedUrl = `${hiddenPath}/${fileName}`;
    }

    uploadOrderDocument(orderCode: string, file: File) {
        const uploadUrl = `${this.remoteServiceBaseUrl}/api/services/app/Inventory/UploadOrderDocument`;
        const formData = new FormData();
        formData.append('orderCode', orderCode);
        formData.append('file', file);
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
