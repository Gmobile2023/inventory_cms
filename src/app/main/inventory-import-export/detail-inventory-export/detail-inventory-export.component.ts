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
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private router: Router,
        private _fileDownloadService: FileDownloadService
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
    description: string;
    orderDataItems: any = {};

    ngOnInit(): void {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Chi tiết yêu cầu xuất kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.orderId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.getStockForView();
    }

    getStockForView() {
        this._inventoryServiceProxy.getOrderForView(this.orderId).subscribe((result) => {
            this.orderData = result.order;
            this.orderDataItems = result.order.items[0];
            if (this.orderData.orderCode) {
                this.orderCode = this.orderData.orderCode;
                this.getActionHistory();
                this.getListSimOrderDetail();
            }
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

    getListSimOrderDetail(event?: LazyLoadEvent) {
        this._inventoryServiceProxy
            .getListSimOrderDetail(
                this.orderId,
                undefined,
                undefined,
                this.primengTableHelper.getSorting(this.dataTable2),
                this.primengTableHelper.getSkipCount(this.paginator2, event),
                this.primengTableHelper.getMaxResultCount(this.paginator2, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listSim = result.items;
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
        this._inventoryServiceProxy.confirmOrder(body).subscribe(() => {
            this.router.navigate(['/app/main/inventory-import-export']);
            this.notify.info(this.l('SavedSuccessfully'));
            this.closeModal();
        });
    }

    exportToExcel(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSimToExcel(undefined, undefined, undefined, undefined, undefined, undefined, undefined)
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
    dataFake = [];
}
