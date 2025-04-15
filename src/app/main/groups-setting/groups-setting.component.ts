import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
    CreateOrEditTelegramGroupDto,
    GroupTelegramInfoStatus,
    InventoryServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTime } from '@node_modules/@types/luxon';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { BsModalRef, BsModalService } from '@node_modules/ngx-bootstrap/modal';

interface Stock {
    stockId: number;
    stockName: string;
    stockCode: string;
}

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
        private _fileDownloadService: FileDownloadService,
        private modalService: BsModalService
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    groupName: string;
    chatId: string;
    status: GroupTelegramInfoStatus = GroupTelegramInfoStatus.Default;
    fromDate: DateTime | undefined;
    toDate: DateTime | undefined;
    userProcess: string | undefined;
    GroupTelegramInfoStatus = GroupTelegramInfoStatus;
    isEdit: boolean = false;
    groupData: any = {};
    stocks: Stock[];
    listStocks: number[] = [];
    listStock: any[] = [];

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Danh sách nhóm nhận thông báo' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.stocks = [{ stockId: 1, stockName: 'New York', stockCode: 'NY' }];
        this.getListStock();
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
                this.stocks = result.items.map((item) => ({
                    stockId: item.id,
                    stockName: item.stockName,
                    stockCode: item.stockCode,
                }));
            });
    }

    getStockCodes(listStocks: any[]): string {
        if (!listStocks || listStocks.length === 0) {
            return '';
        }
        return listStocks.map((stock) => stock.stockCode).join(', ');
    }

    createOrEditTelegramGroup() {
        let body = new CreateOrEditTelegramGroupDto();
        body = { ...this.groupData };
        this._inventoryServiceProxy.createOrEditTelegramGroup(body).subscribe(() => {
            this.closeModal();
            this.getListTelegramGroup();
            if (this.isEdit) {
                this.notify.success(this.l('Sửa nhóm thành công'));
            } else {
                this.notify.success(this.l('Tạo nhóm thành công'));
            }
            this.isEdit = false;
        });
    }

    getTelegramGroupForView(id: number) {
        this._inventoryServiceProxy.getTelegramGroupForView(id).subscribe((result) => {
            this.groupData = result.groupTelegram;
            // Gán `stockId` vào `groupData.items`
            this.groupData.items = result.groupTelegram.listStocks.map((stock) => stock.stockId);

            // Đảm bảo dữ liệu đã có trong `stocks`
            this.stocks = [
                ...this.stocks,
                ...result.groupTelegram.listStocks.filter(
                    (item) => !this.stocks.some((stock) => stock.stockId === item.stockId)
                ),
            ];
        });
    }

    getListTelegramGroupToExcel() {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListTelegramGroupToExcel(
                this.groupName,
                this.chatId,
                this.status,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    resetSearch() {
        this.groupName = undefined;
        this.chatId = undefined;
        this.status = GroupTelegramInfoStatus.Default;
        this.fromDate = undefined;
        this.toDate = undefined;
    }

    openModal(template: TemplateRef<any>, id?: number): void {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-xl' });
        if (id) {
            this.isEdit = true;
            this.getTelegramGroupForView(id);
        } else {
            this.groupData = {};
            this.groupData.status = GroupTelegramInfoStatus.Success;
        }
    }

    closeModal(modalId?: number) {
        this.resetSearch();
        this.modalService.hide(modalId);
    }
}
