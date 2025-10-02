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
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
