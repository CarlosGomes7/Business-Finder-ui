import { Routes } from '@angular/router';

export const routes: Routes = [
    {
		path: 'welcome',
        loadComponent() {
            return import('./commons/welcome/welcome.component').then(m => m.WelcomeComponent);
        }
	},
    {
		path: 'home',
        loadComponent() {
            return import('./business/home/home.component').then(m => m.HomeComponent);
        }
	},
    {
        path: 'leads',
        loadComponent() {
            return import('./business/leads-manager/leads-manager.component').then(m => m.LeadsManagerComponent);
        }
    },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
