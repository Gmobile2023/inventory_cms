import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CountriesServiceProxy, CreateOrEditCountryDto } from '@shared/service-proxies/service-proxies';
import { finalize } from 'rxjs/operators';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './countries.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CountriesComponent extends AppComponentBase {
    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;

    constructor(
        injector: Injector,
        private modalService: BsModalService,
        private _countriesServiceProxy: CountriesServiceProxy
    ) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;
    countryName: string | undefined;
    countryCode: string | undefined;
    statusFilter: number | undefined = undefined;
    filter: string | undefined;
    idCountry: number | undefined;
    saving = false;
    dataGetEdit: any = {};
    dataGetView: any = {};

    ngOnInit() {
        this.items = [{ label: 'Quản lý Quốc gia' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        this.primengTableHelper.defaultRecordsCountPerPage = 5;
    }

    getCountries(event?: LazyLoadEvent) {
        this.primengTableHelper.showLoadingIndicator();
        this._countriesServiceProxy
            .getAll(
                this.filter,
                this.countryCode,
                this.countryName,
                this.statusFilter,
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

    createOrEditCountry() {
        let body = new CreateOrEditCountryDto();
        body.countryCode = this.countryCode;
        body.countryName = this.countryName;
        body.status = this.statusFilter;
        // this.saving = true;
        if (this.idCountry) {
            body.id = this.idCountry;
        }
        this._countriesServiceProxy
            .createOrEdit(body)
            .pipe(
                finalize(() => {
                    // this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.idCountry = undefined;
                this.countryName = undefined;
                this.countryCode = undefined;
                this.statusFilter = undefined;
                this.closeModal();
                this.getCountries();
            });
    }

    getEditCountry(id: number, template: TemplateRef<any>) {
        this._countriesServiceProxy.getCountryForEdit(id).subscribe((result) => {
            this.dataGetEdit = result.country;
            this.idCountry = this.dataGetEdit.id;
            this.countryName = this.dataGetEdit.countryName;
            this.countryCode = this.dataGetEdit.countryCode;
            this.statusFilter = this.dataGetEdit.status;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    deleteCountry(id: number) {
        this.message.confirm(this.l('', id), this.l('Bạn có chắc chắn muốn xoá'), (isConfirmed) => {
            if (isConfirmed) {
                this._countriesServiceProxy.delete(id).subscribe(() => {
                    this.notify.info(this.l('DeletedSuccessfully'));
                    this.getCountries();
                });
            }
        });
    }

    getViewCountry(id: number, template: TemplateRef<any>) {
        this._countriesServiceProxy.getCountryForView(id).subscribe((result) => {
            this.dataGetView = result.country;
        });
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-md' });
    }

    closeModal(modalId?: number) {
        this.modalService.hide(modalId);
    }
}
