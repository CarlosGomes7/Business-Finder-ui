import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business, BusinessType, SearchResults } from '../interfaces/business';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
 private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchBusinesses(searchData: any): Observable<SearchResults> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber'
    });
    return this.http.post<SearchResults>(`${this.apiUrl}/api/businesses/search`, searchData);
  }

  getBusinessTypes(): Observable<BusinessType[]> {
    return this.http.get<BusinessType[]>(`${this.apiUrl}/api/businesses/types`);
  }

  exportBusinesses(businesses: Business[], format: 'csv' | 'json' = 'csv'): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/api/businesses/export`,
      { businesses, format },
      { responseType: 'blob' }
    );
  }
}
