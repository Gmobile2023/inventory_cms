import { Component, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { SimDetailModalComponent } from './sim-detail-modal.component';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import {
    AddSaleStockDto,
    CommonLookupServiceProxy,
    CreateOrEditStockDto,
    InventoryServiceProxy,
    ProductType,
} from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { finalize, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';

@Component({
    templateUrl: './detail-inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryComponent extends AppComponentBase {
    @ViewChild('simDetailModal', { static: true }) simDetailModal: SimDetailModalComponent;
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUpload', { static: false }) excelFileUpload: FileUpload;

    private lazyLoadSubject = new Subject<any>();

    constructor(
        injector: Injector,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private modalService: BsModalService,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _httpClient: HttpClient
    ) {
        super(injector);
        this.lazyLoadSubject.pipe(debounceTime(500)).subscribe((event) => {
            this.getListSims(event);
        });
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    stockId!: number;
    inventoryData: any = {};
    stockCode: string | undefined;
    productType: ProductType = 1;
    mobile: string | undefined;
    serial: string | undefined;
    categoryCode: string | undefined;
    attribute: string | undefined;
    status: number | undefined;
    kitingStatus: number | undefined;
    value: number = 0;
    createData: any = {};
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    userSale: string | undefined;
    productAttribute: any[] = [];
    isSerial: boolean = false;
    simData: any = {};
    stockName: string | undefined;
    orderCode: string | undefined;
    fromDate: any | undefined;
    toDate: any | undefined;
    userProcess: string | undefined;
    listSim: any[] = [];
    listAction: any[] = [];
    priceType: string | undefined;
    valuePrice: number;
    uploadUrl: string;
    fileUpload: any;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Danh sách kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Chi tiết kho' },
        ];
        let interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 0;
            }
        }, 2000);
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.stockId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.getStockForView(this.stockId);
        this.getProvinces();
        this.getProductAttributes();
    }

    onLazyLoad(event: any): void {
        // Gửi sự kiện vào Subject
        this.primengTableHelper.showLoadingIndicator();
        this.lazyLoadSubject.next(event);
    }

    getStockForView(id: number) {
        this._inventoryServiceProxy.getStockForView(id).subscribe((result) => {
            this.inventoryData = result.inventory;
            // this.stockCode = result.inventory.stockCode;
        });
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

    createChildStock() {
        let body = new CreateOrEditStockDto();
        this.createData.stockType = this.createData.stockCode;
        this.createData.parentStockId = this.inventoryData.id;
        body = this.createData;
        this._inventoryServiceProxy.createOrEditStock(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.closeModal();
        });
    }

    getListSims(event?: LazyLoadEvent) {
        if (this.productType == ProductType.Serial) {
            this.isSerial = true;
        } else {
            this.isSerial = false;
        }
        this._inventoryServiceProxy
            .getListSims(
                this.stockId,
                this.productType,
                this.mobile,
                this.serial,
                this.attribute,
                this.status,
                this.kitingStatus,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listSim = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    getProductAttributes() {
        this._inventoryServiceProxy.getProductAttributes('mobile', undefined, 0, 10).subscribe((result) => {
            this.productAttribute = result.items;
        });
    }

    handleAddSaleStock() {
        let body = new AddSaleStockDto();
        body.id = this.stockId;
        body.userSale = this.userSale;
        this._inventoryServiceProxy.addSaleStock(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.closeModal();
        });
    }

    handleGetSimDetail(number: string): void {
        this._inventoryServiceProxy.getSimForView(number, this.productType).subscribe((result) => {
            this.simData = result.data;
        });
        if (!this.isSerial) {
            this.mobile = number;
        } else {
            this.serial = number;
        }
    }

    getSimDetail(number: string, typeModal: any) {
        this.handleGetSimDetail(number);
        this.openModal(typeModal, 'modal-xl');
    }

    getActionHistory(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getHistories(
                undefined,
                undefined,
                undefined,
                !this.isSerial ? this.mobile : undefined,
                this.isSerial ? this.serial : undefined,
                undefined,
                undefined,
                undefined,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.listAction = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    uploadExcel(data: { files: File }): void {
        const formData: FormData = new FormData();
        const file = data.files[0];
        formData.append('file', file, file.name);
        formData.forEach((value, key) => {
            this.fileUpload = value;
        });
        // this._httpClient
        //     .post<any>(this.uploadUrl, formData)
        //     .pipe(finalize(() => this.excelFileUpload.clear()))
        //     .subscribe((response) => {
        //         if (response.success) {
        //             this.notify.success(this.l('ImportUsersProcessStart'));
        //         } else if (response.error != null) {
        //             this.notify.error(this.l('ImportUsersUploadFailed'));
        //         }
        //     });
    }

    handleUpdatePrice() {
        console.log(this.fileUpload);
        this.closeModal();
    }

    onUploadExcelError(): void {
        this.notify.error(this.l('ImportUsersUploadFailed'));
    }

    openModal(template: TemplateRef<any>, typeModal: string, id?: number) {
        this.modalRef = this.modalService.show(template, { id: 1, class: typeModal });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
    onUpload(event) {}
}
