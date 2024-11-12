import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditWardDto, WardsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './wards.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class WardsComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _wardsServiceProxy: WardsServiceProxy
    ) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;
    filter: string | undefined;
    wardCode: string | undefined;
    wardName: string | undefined;
    status: number | undefined = null;
    districtName: string | undefined = null;
    districtId: number | undefined;
    idWard: number | undefined;
    districts: any[] = [];
    dataGetForView: any = {};

    ngOnInit() {
        this.items = [{ label: 'Quản lý Phường/Xã' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getAllDistrictForTableDropdown();
    }

    getWards(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._wardsServiceProxy
            .getAll(
                this.filter,
                this.wardCode,
                this.wardName,
                this.status == null ? undefined : this.status,
                this.districtName == null ? undefined : this.districtName,
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

    getAllDistrictForTableDropdown() {
        this._wardsServiceProxy.getAllDistrictForTableDropdown().subscribe((result) => {
            this.districts = result;
        });
    }

    createOrEditWard() {
        let body = new CreateOrEditWardDto();
        body.wardCode = this.wardCode;
        body.wardName = this.wardName;
        body.status = this.status;
        body.districtId = this.districtId;
        // this.saving = true;
        if (this.idWard) {
            body.id = this.idWard;
        }
        this._wardsServiceProxy
            .createOrEdit(body)
            .pipe(
                finalize(() => {
                    // this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.idWard = undefined;
                this.wardCode = undefined;
                this.wardName = undefined;
                this.status = undefined;
                this.districtId = undefined;
                this.closeModal();
                this.getWards();
            });
    }

    getEditWard(id: number, template: TemplateRef<any>) {
        this._wardsServiceProxy.getWardForEdit(id).subscribe((result) => {
            this.idWard = result.ward.id;
            this.wardCode = result.ward.wardCode;
            this.wardName = result.ward.wardName;
            this.status = result.ward.status;
            this.districtId = result.ward.districtId;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    getViewWard(id: number, template: TemplateRef<any>) {
        this._wardsServiceProxy.getWardForView(id).subscribe((result) => {
            this.dataGetForView = result;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    deleteWard(id: number) {
        this.message.confirm(this.l('Bạn có chắc chắn muốn xoá?', id), this.l('Xoá Phường/Xã'), (isConfirmed) => {
            if (isConfirmed) {
                this._wardsServiceProxy.delete(id).subscribe(() => {
                    this.notify.info(this.l('DeletedSuccessfully'));
                    this.getWards();
                });
            }
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
