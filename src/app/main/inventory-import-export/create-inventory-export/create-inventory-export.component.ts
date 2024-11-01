import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { MenuItem } from 'primeng/api';
@Component({
    templateUrl: './create-inventory-export.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()],
})
export class CreateInventoryExportComponent extends AppComponentBase implements OnInit {
    constructor(injector: Injector) {
        super(injector);
    }
    uploadedFiles: any[] = [];
    selectedRecords: [];
    items: MenuItem[];
    home: MenuItem;
    value: number = 0;
    dataFakeTo = [
        {
            id: 1,
            loai: '898407210016823000',
            ma: 'GOLD',
            ten: '1.000.000',
            donvi: 'VINAPHONE',
        },
        {
            id: 2,
            loai: '898407210016823000',
            ma: 'SILVER',
            ten: '2.000.000',
            donvi: 'VIETTEL',
        },
        {
            id: 3,
            loai: '898407210016823000',
            ma: 'PREMIUM',
            ten: '3.000.000',
            donvi: 'MOBIPHONE',
        },
        {
            id: 4,
            loai: '898407210016823000',
            ma: 'GOLD',
            ten: '4.000.000',
            donvi: 'VINAPHONE',
        },
        {
            id: 5,
            loai: '898407210016823000',
            ma: 'SILVER',
            ten: '5.000.000',
            donvi: 'VIETTEL',
        },
        {
            id: 6,
            loai: '898407210016823000',
            ma: 'PREMIUM',
            ten: '6.000.000',
            donvi: 'MOBIPHONE',
        },
    ];
    dataFakeFrom: any[] = [];
    currentData: any[] = [];
    rowsPerPage = 5;
    currentPage = 0;
    currentDataFrom: any[] = [];

    ngOnInit() {
        this.items = [
            { label: 'Quản lý kho', routerLink: '/app/main/inventory-manager' },
            { label: 'Xuất/Nhập kho', routerLink: '/app/main/inventory-import-export' },
            { label: 'Tạo mới yêu cầu xuất kho' },
        ];
        this.home = { icon: 'pi pi-home', routerLink: '/dashbroad' };
        let interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 0;
            }
        }, 2000);
        this.currentData = this.dataFakeTo.slice(0, this.rowsPerPage);
    }

    onPage(event: any) {
        this.currentPage = event.page;
        this.updateCurrentData();
    }

    onPageFrom(event: any) {
        this.currentPage = event.page;
        this.updateCurrentDataFrom();
    }

    moveSelectedRecords() {
        this.selectedRecords.forEach((record) => {
            const index = this.dataFakeTo.indexOf(record);
            if (index > -1) {
                this.dataFakeTo.splice(index, 1); // Xóa phần tử khỏi dataFakeTo
                this.dataFakeFrom.push(record); // Thêm phần tử vào dataFakeFrom
            }
        });
        this.selectedRecords = []; // Reset lại selectedRecords
        this.updateCurrentData(); // Cập nhật lại currentData sau khi di chuyển
        this.updateCurrentDataFrom();
    }

    moveBackSelectedRecords() {
        // Di chuyển từng phần tử từ dataFakeFrom về dataFakeTo
        this.selectedRecords.forEach((record) => {
            const index = this.dataFakeFrom.indexOf(record);
            if (index > -1) {
                this.dataFakeFrom.splice(index, 1); // Xóa phần tử khỏi dataFakeFrom
                this.dataFakeTo.push(record); // Thêm phần tử vào dataFakeTo
            }
        });
        this.selectedRecords = []; // Xóa danh sách các phần tử đã chọn
        this.updateCurrentData(); // Cập nhật lại currentData cho phân trang
        this.updateCurrentDataFrom();
    }

    updateCurrentData() {
        const start = this.currentPage * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        this.currentData = this.dataFakeTo.slice(start, end); // Cập nhật currentData theo phân trang
    }
    updateCurrentDataFrom() {
        const start = this.currentPage * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        this.currentDataFrom = this.dataFakeFrom.slice(start, end); // Cập nhật dữ liệu của bảng thứ 2 theo phân trang
    }

    onUpload(event) {}
}
