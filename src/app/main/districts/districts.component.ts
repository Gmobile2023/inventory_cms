import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';
import { CreateOrEditDistrictDto, DistrictsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './districts.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DistrictsComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _districtsServiceProxy: DistrictsServiceProxy
    ) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;
    filter: string | undefined;
    districtCode: string | undefined;
    districtName: string | undefined;
    status: number | undefined = null;
    cityName: string | undefined = null;
    cityId: number | undefined;
    idDistrict: number | undefined;
    cities: any[] = [];
    dataGetForView: any = {};

    ngOnInit() {
        this.items = [{ label: 'Địa giới hành chính' }, { label: 'Quản lý Quận/Huyện' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.getCitiesForTableDropdown();
    }

    getDistricts(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._districtsServiceProxy
            .getAll(
                this.filter,
                this.districtCode,
                this.districtName,
                this.status == null ? undefined : this.status,
                this.cityName == null ? undefined : this.cityName,
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

    getCitiesForTableDropdown() {
        this._districtsServiceProxy.getAllCityForTableDropdown().subscribe((result) => {
            this.cities = result;
        });
    }

    createOrEditDistrict() {
        let body = new CreateOrEditDistrictDto();
        body.districtCode = this.districtCode;
        body.districtName = this.districtName;
        body.status = this.status;
        body.cityId = this.cityId;
        // this.saving = true;
        if (this.idDistrict) {
            body.id = this.idDistrict;
        }
        this._districtsServiceProxy
            .createOrEdit(body)
            .pipe(
                finalize(() => {
                    // this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.idDistrict = undefined;
                this.districtCode = undefined;
                this.districtName = undefined;
                this.status = undefined;
                this.cityId = undefined;
                this.closeModal();
                this.getDistricts();
            });
    }

    getEditDistrict(id: number, template: TemplateRef<any>) {
        this._districtsServiceProxy.getDistrictForEdit(id).subscribe((result) => {
            this.idDistrict = result.district.id;
            this.districtCode = result.district.districtCode;
            this.districtName = result.district.districtName;
            this.status = result.district.status;
            this.cityId = result.district.cityId;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    getViewDistrict(id: number, template: TemplateRef<any>) {
        this._districtsServiceProxy.getDistrictForView(id).subscribe((result) => {
            this.dataGetForView = result;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    deleteDistrict(id: number) {
        this.message.confirm(this.l('Bạn có chắc chắn muốn xoá?', id), this.l('Xoá Quận/Huyện'), (isConfirmed) => {
            if (isConfirmed) {
                this._districtsServiceProxy.delete(id).subscribe(() => {
                    this.notify.info(this.l('DeletedSuccessfully'));
                    this.getDistricts();
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
