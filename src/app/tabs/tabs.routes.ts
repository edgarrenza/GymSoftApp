import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('../users/users.page').then((m) => m.UsersPage),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('../clients/clients.page').then((m) => m.ClientsPage),
      },
      {
        path: 'memberships',
        loadComponent: () =>
          import('../memberships/memberships.page').then((m) => m.MembershipsPage),
      },
      {
        path: '',
        redirectTo: '/tabs/users',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/users',
    pathMatch: 'full',
  },
];
