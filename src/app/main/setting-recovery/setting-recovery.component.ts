import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DateTime } from '@node_modules/@types/luxon';
import {
    CommonLookupServiceProxy,
    ConfigureNumberReclaimScheduleDetailDto,
    CreateOrEditConfigureNumberReclaimScheduleDto,
    InventoryServiceProxy,
    UserInfoDto,
} from '@shared/service-proxies/service-proxies';
import { finalize, map, Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    templateUrl: './setting-recovery.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class SettingRecoveryComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
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
    isEdit: boolean = false;
    settingName: string;
    desStockId: number;
    srcStockId: number;
    status: number;
    statusOption = [
        { label: 'Hoạt động', value: 1 },
        { label: 'Khoá', value: 2 },
        { label: 'Chờ kích hoạt', value: 0 },
    ];

    statusSetting = [
        { label: 'Chờ tái sử dụng', value: 1 },
        // { label: 'Đã xuất kho', value: 2 },
    ];

    settingStatus = [
        {
            status: 1,
            day: 0,
            content: '',
        },
    ];
    userList = [];
    configData: any = {};
    filteredUsers: UserInfoDto[] = new Array<UserInfoDto>();
    public dateRange: DateTime[] = [this._dateTimeService.getStartOfMonth(), this._dateTimeService.getEndOfMonth()];
    selectedStockFrom: any;
    selectedStockTo: any;
    listStock: any[] = [];
    idDelete: number;

    ngOnInit() {
        this.items = [{ label: 'Quản lý kho thu hồi' }, { label: 'Cấu hình thời gian lưu số trong kho' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getListStock();
    }

    getListConfigureNumberReclaimSchedules(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListConfigureNumberReclaimSchedules(
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.settingName,
                this.selectedStockFrom?.id,
                this.selectedStockTo?.id,
                this.status,
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
                this.listStock = result.items;
            });
    }

    getOrganizationUnitUsers(id: number): Observable<any[]> {
        return this._commonLookupServiceProxy.getOrganizationUnitUsers(id, undefined, 100, 0).pipe(
            map((result) => result.items) // Chỉ trả về danh sách items
        );
    }

    createOrEditConfigureNumberReclaimSchedule() {
        let body = new CreateOrEditConfigureNumberReclaimScheduleDto();
        body = { ...this.configData };
        if (this.selectedStockFrom) {
            body.srcStockId = this.selectedStockFrom.id;
            body.srcStockName = this.selectedStockFrom.stockName;
        }
        if (this.selectedStockTo) {
            body.desStockId = this.selectedStockTo.id;
            body.desStockName = this.selectedStockTo.stockName;
        }
        if (this.settingStatus) {
            body.items = this.settingStatus.map((item) => {
                return ConfigureNumberReclaimScheduleDetailDto.fromJS(item);
            });
        }
        this._inventoryServiceProxy.createOrEditConfigureNumberReclaimSchedule(body).subscribe(() => {
            this.isEdit = false;
            this.resetData();
            this.getListConfigureNumberReclaimSchedules();
            this.closeModal();
            this.notify.info(this.l('Cài đặt cấu hình thành công!'));
        });
    }

    openConfigureForView(id: number, elModal: TemplateRef<any>, type?: string) {
        if (id) {
            this.getConfigureNumberReclaimScheduleForView(id);
            this.openModal(elModal);
        }
        if (type === 'edit') {
            this.isEdit = true;
        }
    }

    resetData() {
        this.selectedStockFrom = undefined;
        this.selectedStockTo = undefined;
        this.configData = {};
        this.settingStatus = [
            {
                status: 1,
                day: 0,
                content: '',
            },
        ];
    }

    getConfigureNumberReclaimScheduleForView(id: number) {
        this._inventoryServiceProxy.getConfigureNumberReclaimScheduleForView(id).subscribe((result) => {
            this.configData = result.configureNumberReclaimSchedule;
            this.settingStatus = this.configData.items;
            this.selectedStockTo = this.listStock.find((stock) => stock.id === this.configData.desStockId);
            this.selectedStockFrom = this.listStock.find((stock) => stock.id === this.configData.srcStockId);
        });
    }

    openFormDelete(id: number, template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
        if (id) {
            this.idDelete = id;
        }
    }

    deleteConfigureNumberReclaimSchedule() {
        this._inventoryServiceProxy.deleteConfigureNumberReclaimSchedule(this.idDelete).subscribe((result) => {
            this.getListConfigureNumberReclaimSchedules();
            this.closeModal();
        });
    }

    filterUsers(event): void {
        this._commonLookupServiceProxy.getListUserSearch(event.query).subscribe((users) => {
            this.filteredUsers = users;
        });
    }

    openModal(template: TemplateRef<any>) {
        this.resetData();
        this.configData.status = 1;
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-xl' });
    }

    closeModal(modalId?: number) {
        this.isEdit = false;
        this.resetData();
        this.modalService.hide(modalId);
    }
}
