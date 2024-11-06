import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './cities.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CitiesComponent extends AppComponentBase {
    constructor(injector: Injector, private modalService: BsModalService) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;

    ngOnInit() {
        this.items = [{ label: 'Quản lý Tỉnh/Thành Phố' }];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
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
