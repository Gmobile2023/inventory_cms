import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { GroupTelegramInfoStatus, InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTime } from '@node_modules/@types/luxon';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './groups-setting.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class GroupsSettingComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService,
        private _fileDownloadService: FileDownloadService
    ) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    groupName: string;
    chatId: string;
    status: GroupTelegramInfoStatus = GroupTelegramInfoStatus.Default;
    fromDate: DateTime | undefined;
    toDate: DateTime | undefined;
    userProcess: string | undefined;
    GroupTelegramInfoStatus = GroupTelegramInfoStatus;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Danh sách nhóm nhận thông báo' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
    }

    getListTelegramGroup(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListTelegramGroup(
                this.groupName,
                this.chatId,
                this.status,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
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

    getStockCodes(listStocks: any[]): string {
        if (!listStocks || listStocks.length === 0) {
            return '';
        }
        return listStocks.map((stock) => stock.stockCode).join(', ');
    }

    exportToExcel(): void {
        // this.primengTableHelper.showLoadingIndicator();
        // this._inventoryServiceProxy
        //     .getHistoriesToExcel(
        //         this.stockCode,
        //         this.stockName,
        //         this.orderCode,
        //         this.mobile,
        //         this.serial,
        //         this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
        //         this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
        //         this.userProcess
        //     )
        //     .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
        //     .subscribe((result) => {
        //         this._fileDownloadService.downloadTempFile(result);
        //     });
    }

    resetSearch() {
        this.groupName = undefined;
        this.chatId = undefined;
        this.status = GroupTelegramInfoStatus.Default;
        this.fromDate = undefined;
        this.toDate = undefined;
    }
}
