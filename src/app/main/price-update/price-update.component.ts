import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { InventoryServiceProxy, ObjectType, ProductType } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient } from '@angular/common/http';
import { AppConsts } from '@shared/AppConsts';

interface RequestBody {
    stockId: number;
    productType: ProductType;
    objectType: ObjectType;
    priceType: string;
    value: number;
    items: any[];
}

@Component({
    templateUrl: './price-update.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class PriceUpdateComponent extends AppComponentBase implements OnInit {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private route: ActivatedRoute,
        private _inventoryServiceProxy: InventoryServiceProxy,
        private modalService: BsModalService,
        private _httpClient: HttpClient
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    value: number = 0;
    selectedRecords: any[] = [];
    productType: ProductType = ProductType.Mobile;
    stockCode: string;
    stockId: number;
    valuePrice: number;
    objectType: ObjectType;
    isLoading: boolean = false;
    ProductType = ProductType;
    priceType: string;
    priceTypes = [
        { label: 'Thay đổi giá bán', value: 1 },
        { label: 'Cộng thêm % giá bán', value: 2 },
        { label: 'Cộng thêm vào giá bán', value: 3 },
    ];
    objectTypes = [
        { label: 'Tất cả', value: ObjectType.All },
        { label: 'Theo danh sách chọn', value: ObjectType.List },
        { label: 'Theo file', value: ObjectType.File },
    ];
    uploadedFile: File | null = null;
    remoteServiceBaseUrl: string = AppConsts.remoteServiceBaseUrl;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Cập nhật giá định giá' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.stockCode = this.route.snapshot.queryParamMap.get('stockCode');
        this.stockId = parseInt(this.route.snapshot.queryParamMap.get('id'));
    }

    getListSims(event?: LazyLoadEvent) {
        this._inventoryServiceProxy
            .getListSims(
                this.stockId,
                this.productType,
                undefined,
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
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    onProductTypeChange(event: any) {
        this.productType = (event.target as HTMLSelectElement).value as unknown as ProductType;
        this.getListSims();
    }

    handleUpdatePrice() {
        const updatePriceUrl = `${this.remoteServiceBaseUrl}/api/services/app/Inventory/UpdatePrice`;
        const formData = new FormData();
        const body: RequestBody = {
            stockId: this.stockId,
            productType: this.productType,
            objectType: this.objectType,
            priceType: this.priceType,
            value: this.valuePrice,
            items: [],
        };
        if (this.selectedRecords?.length > 0) {
            body.items = this.selectedRecords.map((item: any) => item.mobile);
        } else {
            body.items = [];
        }
        this.isLoading = true;
        const bodyAsJson = JSON.stringify(body);
        formData.append('updatePrice', bodyAsJson);
        formData.append('file', this.uploadedFile);
        this._httpClient.put<any>(updatePriceUrl, formData).subscribe({
            next: (response) => {
                if (response.success) {
                    this.notify.info(this.l('SavedSuccessfully'));
                    this.isLoading = false;
                    this.closeModal();
                    this.getListSims();
                    this.selectedRecords = [];
                    this.valuePrice = 0;
                }
            },
            error: (err) => {
                this.message.error(this.l(err.error.error?.message));
                this.isLoading = false;
            },
        });
    }

    onFileSelect(event: any): void {
        const file = event.files && event.files[0];
        if (file) {
            this.uploadedFile = file;
        }
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
