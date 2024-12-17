import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import { InventoryServiceProxy, ProductType } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTime } from '@node_modules/@types/luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { SimDetailModalComponent } from './sim-detail-modal.component';
import { FileDownloadService } from '@shared/utils/file-download.service';
@Component({
    templateUrl: './inventory-report.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class InventoryReportComponent extends AppComponentBase {
    @ViewChild('simDetailModal', { static: true }) simDetailModal: SimDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService,
        private _fileDownloadService: FileDownloadService,
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    productType: ProductType = ProductType.Serial;
    stockCode: string;
    stockName: string;
    fromDate: DateTime;
    toDate: DateTime;
    parentId: number;
    stockId: number;
    sorting: string = '99';
    status: number = 5;
    skipCount: number = 0;
    maxResultCount: number = 99;
    orderType: number;
    orderList = [];
    totalCountOrder: number;
    productTypes = [
        { label: 'Số', value: ProductType.Mobile },
        { label: 'Serial', value: ProductType.Serial },
    ];

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Báo cáo tồn kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    getListInventoryReport(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListInventoryReport(
                this.productType,
                this.stockCode,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.parentId,
                this.stockId,
                this.sorting,
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    exportToExcel(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListInventoryReportToExcel(
                this.productType,
                this.stockCode,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.parentId,
                this.stockId,
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    openModalOrders(orderType: number, stockCode: string, stockId: number): void {
        this.simDetailModal.show(orderType, stockCode, stockId);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-xl' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
