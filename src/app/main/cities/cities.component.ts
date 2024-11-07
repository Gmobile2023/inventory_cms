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
    cityNameFilter: string | undefined;
    countryCountryNameFilter: string | undefined;
    statusFilter: number | undefined = undefined;
    countryId: number | undefined;
    idCity: number | undefined;

    ngOnInit() {
        this.items = [{ label: 'Quản lý Tỉnh/Thành Phố' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.primengTableHelper.defaultRecordsCountPerPage = 5;
    }

    getCities(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._citiesServiceProxy
            .getAll(
                this.filter,
                this.cityNameFilter,
                this.statusFilter,
                this.countryCountryNameFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .pipe(finalize(() => this.primengTableHelper.hideLoadingIndicator()))
            .subscribe((result) => {
                console.log(result);
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    createOrEditCity() {
        let body = new CreateOrEditCityDto();
        body.cityCode = this.cityCode;
        body.cityName = this.cityNameFilter;
        body.status = this.statusFilter;
        body.countryId = this.statusFilter;
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
                this.cityNameFilter = undefined;
                this.statusFilter = undefined;
                this.closeModal();
                this.getCities();
            });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }

    dataSimFake = [
        {
            ma: '99',
            name: 'Tỉnh Bắc Ninh',
            status: true,
            country: 'Việt Nam',
        },
        {
            ma: '98',
            name: 'Tỉnh Bắc Giang',
            status: true,
            country: 'Việt Nam',
        },
        {
            ma: '90',
            name: 'Tỉnh Hà Nam',
            status: false,
            country: 'Việt Nam',
        },
    ];
}
