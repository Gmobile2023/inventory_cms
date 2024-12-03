import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { InventoryServiceProxy, UpdatePriceDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

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
        private modalService: BsModalService
    ) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;
    value: number = 0;
    selectedRecords: any[] = [];
    productType: string = 'mobile';
    stockCode: string;
    stockId: number;
    priceType: string = 'Change';
    valuePrice: number;
    objectType: string = 'All';
    isLoading: boolean = false;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Cập nhật giá bán' },
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
        this.productType = (event.target as HTMLSelectElement).value;
        this.getListSims();
    }

    handleUpdatePrice() {
        const body = new UpdatePriceDto();
        body.stockId = this.stockId;
        body.productType = this.productType;
        body.objectType = this.objectType;
        body.priceType = this.priceType;
        body.value = this.valuePrice;
        if (this.selectedRecords?.length > 0) {
            body.items = this.selectedRecords.map((item: any) => item.mobile);
        } else {
            body.items = [];
        }
        this.isLoading = true;
        this._inventoryServiceProxy.updatePrice(body).subscribe(() => {
            this.notify.info(this.l('SavedSuccessfully'));
            this.closeModal();
            this.getListSims();
            this.selectedRecords = [];
            this.valuePrice = 0;
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
