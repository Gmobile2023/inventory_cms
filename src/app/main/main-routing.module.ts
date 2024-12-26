import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
                        data: { permission: 'Pages.Tenant.Dashboard' },
                    },
                    {
                        path: 'inventory-manager',
                        loadChildren: () => import('./inventory/inventory.module').then((m) => m.InventoryModule),
                        data: { permission: 'Pages.Inventories.Stock' },
                    },
                    {
                        path: 'inventory-manager/detail-inventory',
                        loadChildren: () =>
                            import('./detail-inventory/detail-inventory.module').then((m) => m.DetailInventoryModule),
                        data: { permission: 'Pages.Inventories.Stock' },
                    },
                    {
                        path: 'action-history',
                        loadChildren: () =>
                            import('./action-history/action-history.module').then((m) => m.ActionHistoryModule),
                        data: { permission: 'Pages.Inventories.Historys' },
                    },
                    {
                        path: 'inventory-import-export',
                        loadChildren: () =>
                            import('./inventory-import-export/inventory-import-export.module').then(
                                (m) => m.InventoryImportExportModule
                            ),
                        data: { permission: 'Pages.Inventories.Orders' },
                    },
                    {
                        path: 'inventory-import-export/create-inventory-import',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/create-inventory-import/create-inventory-import.module'
                            ).then((m) => m.CreateInventoryImportModule),
                        data: { permission: 'Pages.Inventories.Orders.Create' },
                    },
                    {
                        path: 'inventory-import-export/detail-inventory-import',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/detail-inventory-import/detail-inventory-import.module'
                            ).then((m) => m.DetailInventoryImportModule),
                        data: { permission: 'Pages.Inventories.Orders' },
                    },
                    {
                        path: 'inventory-import-export/create-inventory-export',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/create-inventory-export/create-inventory-export.module'
                            ).then((m) => m.CreateInventoryExportModule),
                        data: { permission: 'Pages.Inventories.Transfer.Create' },
                    },
                    {
                        path: 'inventory-import-export/detail-inventory-export',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/detail-inventory-export/detail-inventory-export.module'
                            ).then((m) => m.DetailInventoryExportModule),
                        data: { permission: 'Pages.Inventories.Orders' },
                    },
                    {
                        path: 'inventory-import-export/create-inventory-recall',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/create-inventory-recall/create-inventory-recall.module'
                            ).then((m) => m.CreateInventoryRecallModule),
                        data: { permission: 'Pages.Inventories.Recall.Create' },
                    },
                    {
                        path: 'inventory-import-export/detail-inventory-recall',
                        loadChildren: () =>
                            import(
                                './inventory-import-export/detail-inventory-recall/detail-inventory-recall.module'
                            ).then((m) => m.DetailInventoryRecallModule),
                        data: { permission: 'Pages.Inventories.Orders' },
                    },
                    {
                        path: 'inventory-report',
                        loadChildren: () =>
                            import('./inventory-report/inventory-report.module').then((m) => m.InventoryReportModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'price-update',
                        loadChildren: () =>
                            import('./price-update/price-update.module').then((m) => m.PriceUpdateModule),
                        data: { permission: 'Pages.Inventories.UpdatePrice' },
                    },
                    {
                        path: 'approval-flow-settings',
                        loadChildren: () =>
                            import('./approval-flow-settings/approval-flow-settings.module').then(
                                (m) => m.ApprovalFlowSettingsModule
                            ),
                        data: { permission: 'Pages.Inventories.ApprovalFlow' },
                    },
                    {
                        path: 'groups-setting',
                        loadChildren: () =>
                            import('./groups-setting/groups-setting.module').then((m) => m.GroupsSettingModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'countries',
                        loadChildren: () => import('./countries/countries.module').then((m) => m.CountriesModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'cities',
                        loadChildren: () => import('./cities/cities.module').then((m) => m.CitiesModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'districts',
                        loadChildren: () => import('./districts/districts.module').then((m) => m.DistrictsModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'wards',
                        loadChildren: () => import('./wards/wards.module').then((m) => m.WardsModule),
                        data: { permission: '' },
                    },
                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' },
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class MainRoutingModule {}
