import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem, TreeNode } from 'primeng/api';
import {
    ActivateStockDto,
    CommonLookupServiceProxy,
    CreateOrEditStockDto,
    GetUsersInput,
    InventoryServiceProxy,
    UserInfoDto,
    UserServiceProxy,
} from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { DateTime } from '@node_modules/@types/luxon';

interface CustomTreeNode extends TreeNode {
    stockId?: number;
    stockLevel?: number;
    parentStockId?: number;
    quantity?: number;
}

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
        private _dateTimeService: DateTimeService,
        private _userServiceProxy: UserServiceProxy
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
    inventoryData: any = {
        userManager: new Array<UserInfoDto>(),
        userCreate: new Array<UserInfoDto>(),
        userViewMobile: new Array<UserInfoDto>(),
        userViewSerial: new Array<UserInfoDto>(),
    };
    isEdit = false;
    listStock: any[] = [];
    inventoryId: number;
    stockLevels = [
        // { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
    ];
    filteredUsers: UserInfoDto[] = new Array<UserInfoDto>();
    listStockParent = [];
    selectedCity: any;
    selectedDistrict: any;
    selectedWard: any;
    treeData: CustomTreeNode[];
    typeViewStock: number = 1;
    statusAction: number;
    parentStockName: string;

    ngOnInit() {
        this.inventoryId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        if (this.inventoryId) {
            this._inventoryServiceProxy.getStockForView(this.inventoryId).subscribe((result) => {
                this.parentStockName = result.inventory.stockName;
            });
        }
        this.items = [{ label: 'Quản lý kho' }, { label: this.inventoryId ? 'Danh sách kho con' : 'Danh sách kho' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getProvinces();
    }

    buildTreeByStockLevel = (data: any[]): CustomTreeNode[] => {
        // Tìm node gốc (stockLevel = 0)
        const rootNode = data.find((item) => item.stockLevel === 0);
        if (!rootNode) return []; // Nếu không có node gốc thì trả về mảng rỗng

        // Hàm đệ quy để xây dựng cây
        const buildChildren = (parentId: number): CustomTreeNode[] => {
            return data
                .filter((item) => item.parentStockId === parentId) // Lọc các node con
                .map((item) => ({
                    label: item.stockName,
                    data: item,
                    stockId: item.id,
                    stockLevel: item.stockLevel,
                    quantity: item.quantity,
                    parentStockId: item.parentStockId,
                    children: buildChildren(item.id), // Đệ quy tìm con
                    expanded: true, // Mở rộng mặc định
                }));
        };

        // Xây dựng cây bắt đầu từ rootNode
        return [
            {
                label: rootNode.stockName,
                data: rootNode,
                stockId: rootNode.id,
                stockLevel: rootNode.stockLevel,
                quantity: rootNode.quantity,
                parentStockId: rootNode.parentStockId,
                children: buildChildren(rootNode.id), // Xây dựng cây con
                expanded: true, // Mở rộng mặc định
            },
        ];
    };

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
                this.typeViewStock === 1
                    ? this.primengTableHelper.getMaxResultCount(this.paginator, event)
                    : this.inventoryId
                    ? this.primengTableHelper.getMaxResultCount(this.paginator, event)
                    : 1000
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this.primengTableHelper.records = result.items;
                this.treeData = this.buildTreeByStockLevel(result.items);
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    loadInventoryData(data: any): void {
        this.inventoryData = data;
        // Giả lập dữ liệu userManager và userCreate nếu có
        if (this.inventoryData.userManager) {
            this.inventoryData.userManager = this.inventoryData.userManager.map((userName: string) => ({
                userName: userName,
            }));
        }

        if (this.inventoryData.userCreate) {
            this.inventoryData.userCreate = this.inventoryData.userCreate.map((userName: string) => ({
                userName: userName,
            }));
        }

        if (this.inventoryData.userViewMobile) {
            this.inventoryData.userViewMobile = this.inventoryData.userViewMobile.map((userName: string) => ({
                userName: userName,
            }));
        }

        if (this.inventoryData.userViewSerial) {
            this.inventoryData.userViewSerial = this.inventoryData.userViewSerial.map((userName: string) => ({
                userName: userName,
            }));
        }
    }

    // Lọc user khi nhập vào autocomplete
    filterUsers(event: any): void {
        const query = event.query;
        this._commonLookupServiceProxy.getListUserSearch(query).subscribe((users) => {
            this.filteredUsers = users;
        });
    }

    getInfoUser(userName: any): void {
        this._commonLookupServiceProxy.getListUserSearch(userName).subscribe((users) => {
            return users;
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
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
                this.inventoryId ? this.inventoryId : this.parentId,
                this.status == null ? undefined : this.status
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                this._fileDownloadService.downloadTempFile(result);
            });
    }

    getStockForEdit(id: number) {
        this._inventoryServiceProxy.getStockForView(id).subscribe((result) => {
            this.inventoryData = result.inventory;
            this.loadInventoryData(this.inventoryData);
            if (this.inventoryData.stockLevel) {
                this.getListSuggestStockParent(this.inventoryData.stockLevel);
            }
            if (this.inventoryData.cityId) {
                this.getDistrictByCity(this.inventoryData.cityId);
            }
            if (this.inventoryData.districtId) {
                this.getWardByDistrict(this.inventoryData.districtId);
            }
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
        const selectedCityId = event.value;
        const selectedCity = this.cities.find((city) => city.id === selectedCityId);
        if (selectedCity) {
            this.inventoryData.cityName = selectedCity.cityName;
        }
        this.getDistrictByCity(selectedCityId);
    }

    getDistrictByCity(cityId: number) {
        this._commonLookupServiceProxy.getDistrictByCity(cityId).subscribe((result) => {
            this.districts = result;
        });
    }

    onDistrictChange(event: { value: any }): void {
        const selectedDistrictId = event.value;
        const selectedDistrict = this.districts.find((district) => district.id === selectedDistrictId);
        if (selectedDistrict) {
            this.inventoryData.districtName = selectedDistrict.displayName;
        }
        this.getWardByDistrict(selectedDistrictId);
    }

    getWardByDistrict(districtId: number) {
        this._commonLookupServiceProxy.getWardByDistrict(districtId).subscribe((result) => {
            this.wards = result;
        });
    }

    onWardChange(event: { value: any }): void {
        const selectedWardId = event.value;
        const selectedWard = this.wards.find((ward) => ward.id === selectedWardId);
        if (selectedWard) {
            this.inventoryData.wardName = selectedWard.displayName;
        }
    }

    getListStockParent(event: { value: any }): void {
        const stockLevel = event.value;
        this.getListSuggestStockParent(stockLevel);
    }

    getListSuggestStockParent(stockLevel: number) {
        this._inventoryServiceProxy
            .getListSuggestStockParent(undefined, stockLevel, undefined, undefined, 0, 100)
            .subscribe((result) => {
                this.listStockParent = result.items;
            });
    }

    createOrEditStock() {
        let body = new CreateOrEditStockDto();
        body = { ...this.inventoryData };
        body.userManager = this.inventoryData.userManager?.map((user) => user.userName) || [];
        body.userCreateOrder = this.inventoryData.userCreate?.map((user) => user.userName) || [];
        body.userViewMobile = this.inventoryData.userViewMobile?.map((user) => user.userName) || [];
        body.userViewSerial = this.inventoryData.userViewSerial?.map((user) => user.userName) || [];
        this._inventoryServiceProxy.createOrEditStock(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.resetSearch();
            this.closeModal();
            this.getListStock();
        });
    }

    lockOrUnlockStock() {
        let body = new CreateOrEditStockDto();
        body = { ...this.inventoryData };
        body.userManager = this.inventoryData.userManager?.map((user) => user.userName) || [];
        body.userCreateOrder = this.inventoryData.userCreate?.map((user) => user.userName) || [];
        body.userViewMobile = this.inventoryData.userViewMobile?.map((user) => user.userName) || [];
        body.userViewSerial = this.inventoryData.userViewSerial?.map((user) => user.userName) || [];
        if (this.statusAction === 3) {
            body.status = 1;
        } else {
            body.status = 3;
        }
        this._inventoryServiceProxy.createOrEditStock(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
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

    viewAllStock() {
        this.inventoryId = undefined;
        this.getListStock();
    }

    changeViewStock(event: Event): void {
        const selectedValue = (event.target as HTMLSelectElement).value;
        this.typeViewStock = parseInt(selectedValue);
        this.getListStock();
    }

    openModal(template: TemplateRef<any>, typeModal: string, id?: number, statusProduct?: number): void {
        if (id) {
            this.idAction = id;
            this.statusAction = statusProduct;
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
