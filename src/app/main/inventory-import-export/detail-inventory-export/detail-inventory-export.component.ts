import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { InventoryServiceProxy } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './detail-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DetailInventoryExportComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy
    ) {
        super(injector);
    }
    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    orderId: number;
    orderData: any = {};
    orderCode: string;
    listAction: any[] = [];

    ngOnInit(): void {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Chi tiết yêu cầu xuất kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.orderId = parseInt(this.route.snapshot.queryParamMap.get('id')!);
        this.getStockForView();
    }

    getStockForView() {
        this._inventoryServiceProxy.getOrderForView(this.orderId).subscribe((result) => {
            this.orderData = result.order;
            if (this.orderData.orderCode) {
                this.orderCode = this.orderData.orderCode;
                this.getActionHistory();
            }
        });
    }

    getActionHistory(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._inventoryServiceProxy
            .getHistories(
                undefined,
                undefined,
                this.orderCode,
                undefined,
                undefined,
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

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
    dataFake = [
        {
            id: 1,
            ten: 'Đợt 1 xuất SIM',
            type: 'SIM',
            quantity: '1.000',
            created_at: '20/10/2024 10:12',
            status: 1,
            status_ht: 1,
            approval_date: '25/10/2024 10:12',
        },
        {
            id: 2,
            ten: 'Đợt 2 xuất SIM',
            type: 'SIM',
            quantity: '1.000',
            created_at: '20/10/2024 10:12',
            status: 1,
            status_ht: 1,
            approval_date: '25/10/2024 10:12',
        },
        {
            id: 3,
            ten: 'Đợt 3 xuất SIM',
            type: 'SIM',
            quantity: '1.000',
            created_at: '20/10/2024 10:12',
            status: 0,
            status_ht: 0,
            approval_date: '25/10/2024 10:12',
        },
    ];
    dataHistoryFake = [
        {
            id: 1,
            action: 'Tạo yêu cầu',
            noidung: 'Tạo yêu cầu nhập kho',
            date: '12/10/2024 08:23',
            user: 'Nguyễn Văn Chung',
        },
        {
            id: 2,
            action: 'Tạo yêu cầu',
            noidung: 'Tạo yêu cầu nhập kho',
            date: '12/10/2024 08:23',
            user: 'Nguyễn Văn Chung',
        },
    ];

    dataSimFake = [
        {
            id: 1,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'VINAPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 0,
            date: '26/10/2024 09:30',
        },
        {
            id: 2,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'MOBIPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 1,
            date: '26/10/2024 09:30',
        },
        {
            id: 3,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'VINAPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 0,
            date: '26/10/2024 09:30',
        },
        {
            id: 4,
            phoneNumber: '0987654321',
            serialNumber: '298407210016823226',
            shipment: '0122AA3',
            productType: 'Sim vật lý',
            product: 'SILVER',
            network: 'MOBIPHONE',
            price: '300.000',
            attribute: '105 Nguyễn Tuân',
            status: 1,
            date: '26/10/2024 09:30',
        },
    ];
}
