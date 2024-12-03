import { Component, Injector, Input, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { finalize } from 'rxjs';

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

    constructor(injector: Injector, private _inventoryServiceProxy: InventoryServiceProxy) {
        super(injector);
    }

    active = false;
    saving = false;
    stockCode: string | undefined;
    stockName: string | undefined;
    orderCode: string | undefined;
    mobile: string | undefined;
    serial: string | undefined;
    fromDate: any | undefined;
    toDate: any | undefined;
    userProcess: string | undefined;

    show() {
        this.active = true;
        this.modal.show();
        setTimeout(() => {
            this.getActionHistory();
        }, 100);
    }
    close() {
        this.modal.hide();
    }
    save() {
        console.log('Save');
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
            .subscribe(() => {});
    }

    getH() {
        this.getActionHistory();
    }
}
