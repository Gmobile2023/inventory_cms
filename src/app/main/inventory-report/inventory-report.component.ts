import { Component, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: './inventory-report.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class InventoryReportComponent extends AppComponentBase {
    constructor(injector: Injector, private modalService: BsModalService) {
        super(injector);
    }

    modalRef?: BsModalRef | null;
    items: MenuItem[];
    home: MenuItem;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Báo cáo tồn kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
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
            productCode: 'XXX',
            productName: 'XXXXX',
            quantityBefore: '1000',
            quantityAfter: '800',
            quantityImport: '100',
            quantityExport: '200',
        },
        {
            id: 2,
            productCode: 'XXX',
            productName: 'XXXXX',
            quantityBefore: '1000',
            quantityAfter: '800',
            quantityImport: '100',
            quantityExport: '200',
        },
        {
            id: 3,
            productCode: 'XXX',
            productName: 'XXXXX',
            quantityBefore: '1000',
            quantityAfter: '800',
            quantityImport: '100',
            quantityExport: '200',
        },
    ];
}
