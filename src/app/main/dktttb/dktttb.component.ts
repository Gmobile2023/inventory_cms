import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DateTime } from '@node_modules/@types/luxon';
import {
    ApprovalFlowDetailDto,
    CommonLookupServiceProxy,
    CreateOrEditApprovalFlowDto,
    InventoryServiceProxy,
    ListResultDtoOfOrganizationUnitDto,
    OrganizationUnitServiceProxy,
    ProductType,
    UserInfoDto,
} from '@shared/service-proxies/service-proxies';
import { finalize, firstValueFrom, map, Observable } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    templateUrl: './dktttb.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class RegistrationTTTBComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _commonLookupServiceProxy: CommonLookupServiceProxy,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private _dateTimeService: DateTimeService,
        private _organizationUnitService: OrganizationUnitServiceProxy
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    // date: DateTime;
    stock: number;
    stockLevel: number;
    productType: ProductType;
    stockId: number;
    fromDate: DateTime;
    toDate: DateTime;
    status: number = 99;
    description: string;
    name: string;
    isEdit: boolean = false;
    statusOption = [
        { label: 'Hoạt động', value: 1 },
        { label: 'Khoá', value: 2 },
    ];
    stockLevels = [
        { label: 'Cấp 0', value: 1 },
        { label: 'Cấp 1', value: 2 },
        { label: 'Cấp 2', value: 3 },
        { label: 'Cấp 3', value: 4 },
        { label: 'Cấp 4', value: 5 },
        { label: 'Cấp 5', value: 6 },
        { label: 'Cấp 6', value: 7 },
        { label: 'Cấp 7', value: 8 },
        { label: 'Cấp 8', value: 9 },
        { label: 'Cấp 9', value: 10 },
        { label: 'Cấp 10', value: 11 },
    ];
    importantlist = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
    ];
    productTypes = [
        { label: 'Tất cả', value: undefined },
        { label: 'Số', value: ProductType.Mobile },
        { label: 'Serial', value: ProductType.Serial },
    ];
    tempApprovalItems = [
        {
            officeCode: '',
            officeName: '',
            userName: '',
            order: null,
        },
    ];
    departmentList = [];
    userList: any[] = [];
    stockList = [];
    listStockParent = [];
    selectedDepartment: any;
    approvalFlowData: any = {};
    filteredUsers: UserInfoDto[] = new Array<UserInfoDto>();
    public dateRange: DateTime[] = [this._dateTimeService.getStartOfMonth(), this._dateTimeService.getEndOfMonth()];
    selectedStock: any;
    selectedStockFilter: any;
    isChecked: boolean = false;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Cài đặt luồng duyệt' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getTreeDataFromServer();
        this.getListStock();
    }

    getListApprovalFlow(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getListApprovalFlow(
                this.selectedStockFilter ? this.selectedStockFilter.id : undefined,
                this._dateTimeService.getStartOfDayForDate(this.fromDate) ?? undefined,
                this._dateTimeService.getEndOfDayForDate(this.toDate) ?? undefined,
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
                this.stockList = result.items;
            });
    }

    private getTreeDataFromServer(): void {
        this._commonLookupServiceProxy
            .getOrganizationUnits()
            .subscribe((result: ListResultDtoOfOrganizationUnitDto) => {
                this.departmentList = result.items.filter((item) => item.parentId !== null);
            });
    }

    onDepartmentChange(event: any, item: any): void {
        const selectedCode = event.value; // Lấy mã code từ dropdown
        const selectedDepartment = this.departmentList.find((dept) => dept.code === selectedCode); // Lấy đối tượng phòng ban
        if (selectedDepartment) {
            const selectedId = selectedDepartment.id;
            item.officeName = selectedDepartment.displayName;
            this.getOrganizationUnitUsers(selectedId).subscribe((users) => {
                item.userList = users; // Gán danh sách user cho từng item
            });
        }
    }

    getOrganizationUnitUsers(id: number): Observable<any[]> {
        return this._commonLookupServiceProxy.getOrganizationUnitUsers(id, undefined, 100, 0).pipe(
            map((result) => result.items) // Chỉ trả về danh sách items
        );
    }

    onChangeStockLevel(event: { value: any }) {
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

    isOrderValid(data: { order: number }[]): boolean {
        for (let i = 1; i < data.length; i++) {
            if (data[i].order <= data[i - 1].order) {
                this.message.error(this.l('Vui lòng kiểm tra lại độ ưu tiên!'));
                return false;
            }
        }
        return true;
    }

    createOrEditApprovalFlow() {
        let body = new CreateOrEditApprovalFlowDto();
        body = { ...this.approvalFlowData };
        body.stockLevel = this.approvalFlowData.stockLevel - 1;
        if (this.selectedStock) {
            body.stockId = this.selectedStock.id;
        } else {
            body.stockId = undefined;
        }
        if (this.tempApprovalItems) {
            body.items = this.tempApprovalItems.map((item) => {
                return ApprovalFlowDetailDto.fromJS(item);
            });
        }
        if (this.isOrderValid(body.items)) {
            this._inventoryServiceProxy.createOrEditApprovalFlow(body).subscribe(() => {
                this.isEdit = false;
                this.selectedStock = undefined;
                this.tempApprovalItems = [];
                this.addUserRow();
                this.approvalFlowData = {};
                this.getListApprovalFlow();
                this.closeModal();
                this.notify.info(this.l('SavedSuccessfully'));
            });
        }
    }

    openApprovalView(id: number, elModal: TemplateRef<any>, type?: string) {
        if (id) {
            this.getApprovalFlowForView(id);
            this.openModal(elModal);
        }
        if (type === 'edit') {
            this.isEdit = true;
        }
    }

    getApprovalFlowForView(id: number) {
        this._inventoryServiceProxy.getApprovalFlowForView(id).subscribe((result) => {
            this.getListSuggestStockParent(result.approvalFlow.stockLevel + 1);
            this.approvalFlowData = result.approvalFlow;
            this.approvalFlowData.stockLevel = result.approvalFlow.stockLevel + 1;
            this.tempApprovalItems = result.approvalFlow.items;
            if (this.isEdit) {
                this.tempApprovalItems.forEach((item: any) => {
                    const department = this.departmentList.find((dept) => dept.code === item.officeCode);
                    if (department) {
                        const departmentId = department.id;
                        this.getOrganizationUnitUsers(departmentId).subscribe((users) => {
                            item.userList = users; // Gán danh sách user vào từng item
                        });
                    }
                });
            }
            setTimeout(() => {
                const stockId = result.approvalFlow.stockId;
                this.selectedStock = this.listStockParent.find((stock) => stock.id === stockId) || null;
            }, 150);
        });
    }

    filterUsers(event): void {
        this._commonLookupServiceProxy.getListUserSearch(event.query).subscribe((users) => {
            this.filteredUsers = users;
        });
    }

    resetFilter() {
        this.stockId = undefined;
        this.fromDate = undefined;
        this.status = undefined;
    }

    addUserRow() {
        this.tempApprovalItems.push({
            officeCode: '',
            officeName: '',
            userName: '',
            order: null,
        });
    }

    removeRow(index: number): void {
        if (this.tempApprovalItems.length > 1) {
            this.tempApprovalItems.splice(index, 1);
        } else {
            // Thông báo cho người dùng nếu muốn
            console.warn('Không thể xóa.');
        }
    }

    resetDataAdd() {
        this.isEdit = false;
        this.approvalFlowData = {};
        this.approvalFlowData.status = 1;
        this.tempApprovalItems = [
            {
                officeCode: '',
                officeName: '',
                userName: '',
                order: null,
            },
        ];
        this.selectedStock = undefined;
    }

    openModal(template: TemplateRef<any>) {
        this.resetDataAdd();
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-xl' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
