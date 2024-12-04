import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import {
    ActivateStockDto,
    CommonLookupServiceProxy,
    CreateOrEditStockDto,
    InventoryServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTime } from '@node_modules/@types/luxon';

@Component({
    templateUrl: './inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class InventoryComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    constructor(
        injector: Injector,
        private route: ActivatedRoute,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _fileDownloadService: FileDownloadService,
        private modalService: BsModalService,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    public dateRange: DateTime[] = [this._dateTimeService.getStartOfMonth(), this._dateTimeService.getEndOfMonth()];

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    stockCode: string | undefined;
    stockName: string | undefined;
    cityId: number | undefined;
    districtId: number | undefined;
    wardId: number | undefined;
    fromDate: DateTime | undefined;
    toDate: DateTime | undefined;
    parentId: number | undefined;
    status: number | undefined;
    stockLevel: number;
    parentStockId: number | undefined;
    address: string | undefined;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    idAction: number;
    inventoryData: any = {};
    isEdit = false;
    listStock: any[] = [];
    inventoryId!: number;
    stockLevels = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
    ];

    ngOnInit() {
        this.items = [{ label: 'Quản lý kho' }, { label: 'Danh sách kho' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.inventoryId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.getProvinces();
    }

    getListStock(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListStock(
                this.stockCode,
                this.stockName,
                this.cityId,
                this.districtId,
                this.wardId,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.inventoryId ? this.inventoryId : this.parentId,
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

    exportToExcel(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListStockToExcel(
                this.stockCode,
                this.stockName,
                this.cityId,
                this.districtId,
                this.wardId,
                this.fromDate,
                this.toDate,
                this.inventoryId ? this.inventoryId : this.parentId,
                this.status == null ? undefined : this.status,
            )
            .subscribe((result) => {
                this.primengTableHelper.hideLoadingIndicator();
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    getStockForEdit(id: number) {
        this._inventoryServiceProxy.getStockForView(id).subscribe((result) => {
            this.inventoryData = result.inventory;
            this.getDistrictByCity(this.inventoryData.cityId);
            this.getWardByDistrict(this.inventoryData.districtId);
        });
    }

    resetSearch() {
        this.stockCode = undefined;
        this.stockName = undefined;
        this.cityId = undefined;
        this.districtId = undefined;
        this.wardId = undefined;
        this.fromDate = undefined;
        this.toDate = undefined;
        this.address = undefined;
        this.stockLevel = undefined;
        this.parentStockId = undefined;
    }

    getProvinces() {
        this._commonLookupServiceProxy.getProvinces().subscribe((result) => {
            this.cities = result;
        });
    }

    onCityChange(event: { value: any }): void {
        const selectedCity = event.value;
        this.getDistrictByCity(selectedCity);
    }

    getDistrictByCity(cityId: number) {
        this._commonLookupServiceProxy.getDistrictByCity(cityId).subscribe((result) => {
            this.districts = result;
        });
    }

    onDistrictChange(event: { value: any }): void {
        const selectedDistrict = event.value;
        this.getWardByDistrict(selectedDistrict);
    }

    getWardByDistrict(districtId: number) {
        this._commonLookupServiceProxy.getWardByDistrict(districtId).subscribe((result) => {
            this.wards = result;
        });
    }

    createOrEditStock() {
        let body = new CreateOrEditStockDto();
        if (!this.isEdit) {
            this.inventoryData.stockType = this.inventoryData.stockCode;
        } else {
            this.inventoryData.userManager == undefined
                ? (this.inventoryData.userManager = [])
                : this.inventoryData.userManager;
            this.inventoryData.userCreateOrder == undefined
                ? (this.inventoryData.userCreateOrder = [])
                : this.inventoryData.userCreateOrder;
            this.inventoryData.userApprove == undefined
                ? (this.inventoryData.userApprove = [])
                : this.inventoryData.userApprove;
            this.inventoryData.userAccounting == undefined
                ? (this.inventoryData.userAccounting = [])
                : this.inventoryData.userAccounting;
        }
        body = this.inventoryData;
        this._inventoryServiceProxy.createOrEditStock(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.resetSearch();
            this.closeModal();
            this.getListStock();
        });
    }

    activateStock() {
        let body = new ActivateStockDto();
        body.id = this.idAction;
        this._inventoryServiceProxy.activateStock(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.closeModal();
            this.getListStock();
        });
    }

    openModal(template: TemplateRef<any>, typeModal: string, id?: number) {
        if (id) {
            this.isEdit = true;
            this.getStockForEdit(id);
        } else {
            this.isEdit = false;
            this.inventoryData = {};
        }
        this.modalRef = this.modalService.show(template, { id: 1, class: typeModal });
    }

    closeModal(modalId?: number) {
        this.resetSearch();
        this.modalService.hide(modalId);
    }
}
