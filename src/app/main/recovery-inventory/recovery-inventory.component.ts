import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DateTime } from '@node_modules/@types/luxon';
import {
    InventoryServiceProxy,
    SimRecoveryProviderStatus,
    SimRecoveryStatus,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    templateUrl: './recovery-inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class RecoveryInventoryComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    mobile: string;
    telCo: string;
    batchCode: string;
    fromDate: DateTime;
    toDate: DateTime;
    status: SimRecoveryStatus = SimRecoveryStatus.Default;
    statusProvider: SimRecoveryProviderStatus = SimRecoveryProviderStatus.Default;
    network = [
        { label: 'Tất cả', value: 0 },
        { label: 'Vinaphone', value: 1 },
        { label: 'Mobifone', value: 1 },
        { label: 'Vietnamobile', value: 1 },
        { label: 'Gsim', value: 1 },
    ];
    statusNetwork = [
        { label: 'Tất cả', value: SimRecoveryProviderStatus.Default },
        { label: 'Khoá 1 chiều', value: SimRecoveryProviderStatus.OneWayLock },
        { label: 'Khoá 2 chiều', value: SimRecoveryProviderStatus.TwoWayLock },
        // { label: 'Huỷ', value: SimRecoveryProviderStatus.Default },
        { label: 'Thu hồi', value: SimRecoveryProviderStatus.Revoked },
    ];
    statusGmobile = [
        { label: 'Tất cả', value: SimRecoveryStatus.Default },
        { label: 'Thu hồi', value: SimRecoveryStatus.Revoked },
        { label: 'Chờ tái sử dụng', value: SimRecoveryStatus.Waiting },
        { label: 'Đã xuất kho', value: 0 },
        { label: 'Khoá 1 chiều', value: SimRecoveryStatus.OneWayLock },
        { label: 'Khoá 2 chiều', value: SimRecoveryStatus.TwoWayLock },
        { label: 'Hoạt động', value: SimRecoveryStatus.Activity },
    ];

    public dateRange: DateTime[] = [this._dateTimeService.getStartOfMonth(), this._dateTimeService.getEndOfMonth()];

    ngOnInit() {
        this.items = [{ label: 'Quản lý kho thu hồi' }, { label: 'Danh sách thuê bao' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    getListSimRecalls(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSimRecalls(
                this.mobile,
                this.telCo,
                this.batchCode,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.status,
                this.statusProvider,
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

    resetFilter() {
        this.mobile = undefined;
        this.fromDate = undefined;
        this.toDate = undefined;
        this.status = undefined;
        this.statusProvider = undefined;
        this.telCo = undefined;
    }
}
