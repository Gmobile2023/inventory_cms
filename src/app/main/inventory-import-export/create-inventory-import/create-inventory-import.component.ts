import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
@Component({
    templateUrl: './create-inventory-import.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryImportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }

    uploadedFiles: any[] = [];
    items: MenuItem[];
    home: MenuItem;
    dataFake = [{ id: 1 }];
    indexData: number = 1;
    value: number = 0;

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/warehouse-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu nhập kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        let interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 0;
            }
        }, 2000);
    }

    addRow() {
        this.indexData++;
        console.log(this.indexData);
        const item = { id: this.indexData };
        this.dataFake.push(item);
    }

    onBasicUploadAuto(event) {
        console.log('Upload success');
    }

    onUpload(event) {}
}
