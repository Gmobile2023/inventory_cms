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
        private modalService: BsModalService
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    stockCode: string | undefined;
    stockName: string | undefined;
    cityId: number | undefined;
    districtId: number | undefined;
    wardId: number | undefined;
    fromDate: any | undefined;
    toDate: any | undefined;
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
                this.fromDate,
                this.toDate,
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

    onCityChange(event: Event): void {
        const selectedCity = parseInt((event.target as HTMLSelectElement).value);
        this.getDistrictByCity(selectedCity);
    }

    getDistrictByCity(cityId: number) {
        this._commonLookupServiceProxy.getDistrictByCity(cityId).subscribe((result) => {
            this.districts = result;
        });
    }

    onDistrictChange(event: Event): void {
        const selectedDistrict = parseInt((event.target as HTMLSelectElement).value);
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
