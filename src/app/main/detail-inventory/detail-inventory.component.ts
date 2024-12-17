import { Component, InjectionToken, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AddSaleStockDto,
    CommonLookupServiceProxy,
    CreateOrEditStockDto,
    InventoryServiceProxy,
    ProductType,
    SettingType,
    UserInfoDto,
} from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { finalize, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { AppConsts } from '@shared/AppConsts';
import { FileDownloadService } from '@shared/utils/file-download.service';

@Component({
    templateUrl: './detail-inventory.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    @ViewChild('ExcelFileUploadKitting', { static: false }) ExcelFileUploadKitting: FileUpload;

    private lazyLoadSubject = new Subject<any>();

    constructor(
        injector: Injector,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private modalService: BsModalService,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _httpClient: HttpClient,
        private router: Router,
        private _fileDownloadService: FileDownloadService,
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
    productType: ProductType = ProductType.Serial;
    ProductType = ProductType;
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
    userSale: any[] = [];
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
    uploadedFile: File | null = null;
    filteredUsers: UserInfoDto[] = new Array<UserInfoDto>();
    type: SettingType = SettingType.Kiting;
    SettingType = SettingType;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

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

    filterUsers(event): void {
        this._commonLookupServiceProxy.getListUserSearch(event.query).subscribe((users) => {
            this.filteredUsers = users;
        });
    }

    onLazyLoad(event: any): void {
        // Gửi sự kiện vào Subject
        this.primengTableHelper.showLoadingIndicator();
        this.lazyLoadSubject.next(event);
    }

    getStockForView(id: number) {
        this._inventoryServiceProxy.getStockForView(id).subscribe((result) => {
            this.inventoryData = result.inventory;
            this.createData.stockLevel = this.inventoryData.stockLevel + 1;
        });
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

    createChildStock() {
        let body = new CreateOrEditStockDto();
        body = { ...this.createData };
        body.parentStockId = this.inventoryData.id;
        body.userManager = this.createData.userManager?.map((user) => user.userName) || [];
        body.userCreateOrder = this.createData.userCreateOrder?.map((user) => user.userName) || [];
        body.userApprove = this.createData.userApprove?.map((user) => user.userName) || [];
        body.userAccounting = this.createData.userAccounting?.map((user) => user.userName) || [];
        // console.log(body);
        this._inventoryServiceProxy.createOrEditStock(body).subscribe(() => {
            this.router.navigate(['/app/main/inventory-import-export']);
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

    exportToExcel(): void {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListSimToExcel(
                this.stockId,
                this.productType,
                this.mobile,
                this.serial,
                this.attribute,
                this.status,
                this.kitingStatus,
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
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
        body.userSale = this.userSale[0].userName;
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

    onFileSelect(event: any): void {
        const file = event.files && event.files[0];
        if (file) {
            this.uploadedFile = file;
        }
    }

    uploadFileWithKitting(stockId: number, type: SettingType, file: File): void {
        const uploadUrl = `${this.remoteServiceBaseUrl}/api/services/app/Inventory/CreateKitting`;
        const formData = new FormData();
        formData.append('stockId', stockId.toString());
        formData.append('type', type.toString());
        formData.append('file', file);

        this._httpClient.post<any>(uploadUrl, formData).subscribe({
            next: (response) => {
                if (response.success) {
                    this.closeModal();
                    this.notify.success(this.l('Tạo Kitting thành công'));
                }
            },
            error: (err) => {
                this.message.error(this.l(err.error.error?.message));
            },
        });
    }

    createKitting(): void {
        this.uploadFileWithKitting(this.stockId, this.type, this.uploadedFile);
    }

    openModal(template: TemplateRef<any>, typeModal: string, id?: number) {
        this.modalRef = this.modalService.show(template, { id: 1, class: typeModal });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
