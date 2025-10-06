import { Component } from '@angular/core';
import { Business, BusinessType, SearchResults } from '../../interfaces/business';
import { BusinessService } from '../../services/business.service';
import { GeolocationService } from '../../services/geolocation.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-home',
  imports: [FormsModule, GoogleMapsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent {
title = 'Business Finder';

  searchParams = {
    lat: -12.0464, // Lima, Peru por defecto
    lng: -77.0428,
    radius: 5000
  };

  center: google.maps.LatLngLiteral = {
    lat: this.searchParams.lat,
    lng: this.searchParams.lng
  };
  zoom = 13;
  markerPosition = { ...this.center };

  selectedBusinessTypes: string[] = ['establishment'];
  businessTypes: BusinessType[] = [];
  isLoading = false;
  errorMessage = '';
  searchResults: SearchResults | null = null;
  showBusinessesWithoutWebsite = true;
  showBusinessesWithWebsite = false;
  leadList: Business[] = [];

  constructor(
    private businessService: BusinessService,
    private geolocationService: GeolocationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBusinessTypes();
  }

  loadBusinessTypes() {
    this.businessService.getBusinessTypes().subscribe({
      next: (types) => {
        this.businessTypes = types;
      },
      error: (error) => {
        console.error('Error loading business types:', error);
      }
    });
  }

  onBusinessTypeChange(event: any) {
    const value = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedBusinessTypes.push(value);
    } else {
      this.selectedBusinessTypes = this.selectedBusinessTypes.filter(type => type !== value);
    }
  }

  getCurrentLocation() {
    this.isLoading = true;
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.searchParams.lat = position.coords.latitude;
        this.searchParams.lng = position.coords.longitude;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'No se pudo obtener la ubicación actual. Verifica los permisos de ubicación.';
        this.isLoading = false;
      }
    });
  }

  isValidLocation(): boolean {
    return this.searchParams.lat !== 0 && this.searchParams.lng !== 0;
  }

  searchBusinesses() {
    if (!this.isValidLocation()) {
      this.errorMessage = 'Por favor, ingresa una ubicación válida';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const searchData = {
      location: {
        lat: this.searchParams.lat,
        lng: this.searchParams.lng
      },
      radius: this.searchParams.radius,
      businessTypes: this.selectedBusinessTypes.length > 0 ? this.selectedBusinessTypes : ['establishment']
    };

    this.businessService.searchBusinesses(searchData).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
        console.log('Search results:', results);
      },
      error: (error) => {
        this.errorMessage = 'Error al buscar negocios. Verifica que el servidor esté ejecutándose.';
        this.isLoading = false;
        console.error('Search error:', error);
      }
    });
  }

  getDisplayBusinesses(): Business[] {
    if (!this.searchResults) return [];
    
    if (this.showBusinessesWithoutWebsite) {
      return this.searchResults.businesses.withoutWebsite;
    } else {
      return this.searchResults.businesses.withWebsite;
    }
  }

  formatBusinessType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  openInGoogleMaps(business: Business) {
    const url = `https://www.google.com/maps/place/${encodeURIComponent(business.name)}/@${business.location.lat},${business.location.lng},17z`;
    window.open(url, '_blank');
  }

  addToLeadList(business: Business) {
    if (!this.leadList.find(lead => lead.id === business.id)) {
      this.leadList.push(business);
    }
  }

  removeFromLeadList(index: number) {
    this.leadList.splice(index, 1);
  }

  clearLeadList() {
    this.leadList = [];
  }

  exportBusinesses(format: 'csv' | 'json' = 'csv') {
    const businessesToExport = this.getDisplayBusinesses();
    
    if (businessesToExport.length === 0) {
      this.errorMessage = 'No hay negocios para exportar';
      return;
    }

    this.businessService.exportBusinesses(businessesToExport, format).subscribe({
      next: (blob) => {
        this.downloadFile(blob, `businesses.${format}`);
      },
      error: (error) => {
        console.error('Export error:', error);
        this.errorMessage = 'Error al exportar datos';
      }
    });
  }

  exportLeads() {
    if (this.leadList.length === 0) {
      this.errorMessage = 'No hay prospectos para exportar';
      return;
    }

    this.businessService.exportBusinesses(this.leadList, 'csv').subscribe({
      next: (blob) => {
        this.downloadFile(blob, 'leads.csv');
      },
      error: (error) => {
        console.error('Export error:', error);
        this.errorMessage = 'Error al exportar prospectos';
      }
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  goToLeadsManager(): void {
    this.router.navigate(['/leads']);
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.searchParams.lat = event.latLng.lat();
      this.searchParams.lng = event.latLng.lng();
      this.markerPosition = { lat: this.searchParams.lat, lng: this.searchParams.lng };
      this.center = { ...this.markerPosition };
    }
  }

}
