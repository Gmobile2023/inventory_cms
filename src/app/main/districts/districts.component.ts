import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './districts.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class DistrictsComponent extends AppComponentBase {
    constructor(injector: Injector, private modalService: BsModalService) {
        super(injector);
    }

    items: MenuItem[];
    home: MenuItem;
    modalRef?: BsModalRef | null;

    ngOnInit() {
        this.items = [{ label: 'Quản lý Quận/Huyện' }];
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
            ma: '123',
            name: 'Huyện Lý Nhân',
            status: true,
            country: 'Tỉnh Hà Nam',
        },
        {
            ma: '124',
            name: 'Huyện Bình Lục',
            status: true,
            country: 'Tỉnh Hà Nam',
        },
        {
            ma: '125',
            name: 'Huyện Kim Bảng',
            status: false,
            country: 'Tỉnh Hà Nam',
        },
    ];
}
