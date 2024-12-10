import { Component, Injector, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { DateTime } from '@node_modules/@types/luxon';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'simDetailModal',
    templateUrl: './sim-detail-modal.component.html',
})
export class SimDetailModalComponent extends AppComponentBase {
    @ViewChild('createModal', { static: true }) modal: ModalDirective;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @Input() simData: any;
    @Input() inventoryData: any;
    @Input() productType: any;

    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    active = false;
    saving = false;
    orderType: number;
    status: number = 5;
    stockCode: string;
    fromDate: DateTime;
    toDate: DateTime;
    stockId: number;

    getOrdersImport(event?: LazyLoadEvent) {
        this._inventoryServiceProxy
            .getListOrder(
                this.orderType,
                undefined,
                undefined,
                undefined,
                undefined,
                this.stockCode,
                this.status,
                undefined,
                event == undefined ? 0 : event.first,
                event == undefined ? 10 : event.rows
            )
            .subscribe((result) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
            });
    }

    getListOrderInventory(event?: LazyLoadEvent) {
        this._inventoryServiceProxy
            .getListOrderInventory(
                this.stockId,
                this.orderType,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                undefined,
                event == undefined ? 0 : event.first,
                event == undefined ? 10 : event.rows
            )
            .subscribe((result) => {
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
            });
    }

    show(orderType: number, stockCode: string, stockId: number) {
        this.active = true;
        this.modal.show();
        this.orderType = orderType;
        this.stockCode = stockCode;
        this.stockId = stockId;
        this.getOrdersImport();
    }
    close() {
        this.fromDate = undefined;
        this.toDate = undefined;
        this.modal.hide();
    }
}
