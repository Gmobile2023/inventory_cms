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
                        data: { permission: 'Pages.Inventories.TelegramGroup' },
                    },
                    {
                        path: 'recovery-inventory',
                        loadChildren: () =>
                            import('./recovery-inventory/recovery-inventory.module').then(
                                (m) => m.RecoveryInventoryModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'recovery-inventory/create-reuse-number',
                        loadChildren: () =>
                            import('./create-reuse-number/create-reuse-number.module').then(
                                (m) => m.CreateReuseNumberModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'sim-so/order-list',
                        loadChildren: () =>
                            import('./order-list/order-list.module').then(
                                (m) => m.OrderListModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'sim-so/order-detail',
                        loadChildren: () =>
                            import('./order-detail/order-detail.module').then(
                                (m) => m.OrderDetailModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'sim-so/add-order',
                        loadChildren: () =>
                            import('./add-order/add-order.module').then(
                                (m) => m.AddOrderModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'sim-so/dktttb',
                        loadChildren: () =>
                            import('./dktttb/dktttb.module').then(
                                (m) => m.RegistrationTTTBModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'sim-so/list-tttb-lots',
                        loadChildren: () =>
                            import('./list-tttb-lots/list-lots.module').then(
                                (m) => m.ListTTTBLotsModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'sim-so/list-tttb-numbers',
                        loadChildren: () =>
                            import('./list-tttb-numbers/list-numbers.module').then(
                                (m) => m.ListTTTBNumbersModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'recovery-inventory/detail-reuse-number',
                        loadChildren: () =>
                            import('./detail-reuse-number/detail-reuse-number.module').then(
                                (m) => m.DetailReuseNumberModule
                            ),
                        data: { permission: '' },
                    },
                    {
                        path: 'reuse-number',
                        loadChildren: () =>
                            import('./reuse-number/reuse-number.module').then((m) => m.ReuseNumberModule),
                        data: { permission: '' },
                    },
                    {
                        path: 'setting-recovery',
                        loadChildren: () =>
                            import('./setting-recovery/setting-recovery.module').then((m) => m.SettingRecoveryModule),
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
