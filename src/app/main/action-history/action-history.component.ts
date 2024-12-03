import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';

@Component({
    templateUrl: './action-history.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class ActionHistoryComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    stockCode: string | undefined;
    stockName: string | undefined;
    orderCode: string | undefined;
    mobile: string | undefined;
    serial: string | undefined;
    fromDate: any | undefined;
    toDate: any | undefined;
    userProcess: string | undefined;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Lịch sử thao tác' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    getActionHistory(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getHistories(
                this.stockCode,
                this.stockName,
                this.orderCode,
                this.mobile,
                this.serial,
                this.fromDate,
                this.toDate,
                this.userProcess,
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

    resetSearch() {
        this.stockCode = undefined;
        this.stockName = undefined;
        this.orderCode = undefined;
        this.mobile = undefined;
        this.serial = undefined;
        this.fromDate = undefined;
        this.toDate = undefined;
        this.userProcess = undefined;
    }
}
