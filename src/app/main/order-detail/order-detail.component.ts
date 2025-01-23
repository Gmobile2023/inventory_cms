import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DateTime } from '@node_modules/@types/luxon';
import { InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize, map, Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    templateUrl: './order-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class OrderDetailComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    fromDate: DateTime;
    toDate: DateTime;
    status: number = 99;
    description: string;
    name: string;
    isEdit: boolean = false;
    statusOption = [
        { label: 'Chờ phê duyệt', value: 1 },
        { label: 'Đã duyệt', value: 2 },
        { label: 'Từ chối', value: 2 },
    ];
    stockList = [];
    public dateRange: DateTime[] = [this._dateTimeService.getStartOfMonth(), this._dateTimeService.getEndOfMonth()];
    selectedStock: any;
    events: any[];


    ngOnInit() {
        this.items = [{ label: 'SIM SỐ' }, { label: 'Danh sách đơn hàng' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.events = [
            { status: 'Ordered', date: '15/10/2020 10:30', icon: 'pi pi-shopping-cart', color: '#9C27B0', image: 'game-controller.jpg' },
            { status: 'Processing', date: '15/10/2020 14:00', icon: 'pi pi-cog', color: '#673AB7' },
            { status: 'Shipped', date: '15/10/2020 16:15', icon: 'pi pi-shopping-cart', color: '#FF9800' },
            { status: 'Delivered', date: '16/10/2020 10:00', icon: 'pi pi-check', color: '#607D8B' }
        ];
        this.getListStock();
    }

    getListOrder(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListOrder(
                6,
                undefined,
                undefined,
                undefined,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.selectedStock ? this.selectedStock.stockCode : undefined,
                this.status == null ? undefined : this.status,
                this.primengTableHelper.getSorting(this.dataTable),
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
                this.stockList = result.items;
            });
    }

    resetFilter() {
        this.fromDate = undefined;
        this.toDate = undefined;
        this.status = undefined;
        this.selectedStock = undefined;
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-xl' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }

    statusData = [
        { value: '12,689', label: 'Thành công', icon: 'fa fa-check' },
        { value: '25', label: 'Chưa có thông tin vận chuyển', icon: 'fa fa-times' },
        { value: '124', label: 'Đã giao đơn vị vận chuyển', icon: 'fa fa-truck' },
        { value: '32', label: 'Lưu nháp', icon: 'fa fa-info-circle' }
      ];
      
}
