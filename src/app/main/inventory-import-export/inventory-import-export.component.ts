import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { finalize } from 'rxjs';
import { InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTime } from '@node_modules/@types/luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    templateUrl: './inventory-import-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class InventoryImportExportComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }
    public dateRange: DateTime[] = [this._dateTimeService.getStartOfMonth(), this._dateTimeService.getEndOfMonth()];
    items: MenuItem[];
    home: MenuItem;
    orderType: number | undefined;
    orderCode: string | undefined;
    orderTitle: string | undefined;
    fromDate: DateTime | undefined;
    toDate: DateTime | undefined;
    stockCode: string | undefined;
    status: number = 99;

    ngOnInit() {
        this.items = [{ label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' }, { label: 'Xuất/Nhập kho' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    getListOrder(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListOrder(
                this.orderType,
                this.orderCode,
                this.orderTitle,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.stockCode,
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

    resetSearch() {
        this.orderType = undefined;
        this.orderCode = undefined;
        this.orderTitle = undefined;
        this.fromDate = undefined;
        this.toDate = undefined;
        this.stockCode = undefined;
        this.status = 99;
    }
}
