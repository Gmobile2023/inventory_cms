import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CitiesServiceProxy, CreateOrEditCityDto } from '@shared/service-proxies/service-proxies';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { finalize } from 'rxjs/operators';

@Component({
    templateUrl: './cities.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CitiesComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _citiesServiceProxy: CitiesServiceProxy
    ) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;
    filter: string | undefined;
    cityCode: string | undefined;
    cityName: string | undefined;
    cityNameFilter: string | undefined;
    countryCountryNameFilter: string | undefined;
    statusFilter: number | undefined = null;
    countryId: number | undefined;
    idCity: number | undefined;
    countries: any[] = [];
    dataGetForView: any = {};

    ngOnInit() {
        this.items = [{ label: 'Địa giới hành chính' }, { label: 'Quản lý Tỉnh/Thành Phố' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.primengTableHelper.defaultRecordsCountPerPage = 5;
        this.getCountriesForTableDropdown();
    }

    getCities(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._citiesServiceProxy
            .getAll(
                this.filter,
                this.cityNameFilter,
                this.statusFilter == null ? undefined : this.statusFilter,
                this.countryCountryNameFilter,
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

    getCountriesForTableDropdown() {
        this._citiesServiceProxy.getAllCountryForTableDropdown().subscribe((result) => {
            this.countries = result;
        });
    }

    createOrEditCity() {
        let body = new CreateOrEditCityDto();
        body.cityCode = this.cityCode;
        body.cityName = this.cityName;
        body.status = this.statusFilter;
        body.countryId = this.countryId;
        // this.saving = true;
        if (this.idCity) {
            body.id = this.idCity;
        }
        this._citiesServiceProxy
            .createOrEdit(body)
            .pipe(
                finalize(() => {
                    // this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.idCity = undefined;
                this.cityCode = undefined;
                this.cityName = undefined;
                this.statusFilter = undefined;
                this.countryId = undefined;
                this.closeModal();
                this.getCities();
            });
    }

    getEditCity(id: number, template: TemplateRef<any>) {
        this._citiesServiceProxy.getCityForEdit(id).subscribe((result) => {
            this.idCity = result.city.id;
            this.cityCode = result.city.cityCode;
            this.cityName = result.city.cityName;
            this.statusFilter = result.city.status;
            this.countryId = result.city.countryId;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    getViewCity(id: number, template: TemplateRef<any>) {
        this._citiesServiceProxy.getCityForView(id).subscribe((result) => {
            this.dataGetForView = result;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    deleteCity(id: number) {
        this.message.confirm(this.l('Bạn có chắc chắn muốn xoá?', id), this.l('Xoá Tỉnh/Thành phố'), (isConfirmed) => {
            if (isConfirmed) {
                this._citiesServiceProxy.delete(id).subscribe(() => {
                    this.notify.info(this.l('DeletedSuccessfully'));
                    this.getCities();
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
