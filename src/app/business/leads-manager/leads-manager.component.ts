import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProcessedLead } from '../../interfaces/ProcessedLead';

@Component({
  selector: 'app-leads-manager',
  imports: [FormsModule],
  templateUrl: './leads-manager.component.html',
  styleUrl: './leads-manager.component.scss'
})

export class LeadsManagerComponent implements OnInit  {
  leads: ProcessedLead[] = [];
  filteredLeads: ProcessedLead[] = [];
  selectedFile: File | null = null;
  loading = false;
  filterPriority: string = 'all';
  searchTerm: string = '';  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async uploadCSV(): Promise<void> {
    if (!this.selectedFile) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    try {
      const response = await this.http.post<ApiResponse>(
        `${environment.apiUrl}/api/leads/process-csv`,
        formData
      ).toPromise();
      
      this.leads = response?.data || []; 
      this.filteredLeads = [...this.leads];
      this.loading = false;
    } catch (error) {
      console.error('Error processing CSV:', error);
      this.loading = false;
      alert('Error al procesar el archivo CSV'); 
    }
  }

  async uploadJSON(jsonData: any): Promise<void> {
    this.loading = true;
    
    try {
      const response = await this.http.post<ApiResponse>(
       `${environment.apiUrl}/api/leads/process-json`,
        { leads: jsonData }
      ).toPromise();
      
      this.leads = response?.data || []; 
      this.filteredLeads = [...this.leads];
      this.loading = false;
    } catch (error) {
      console.error('Error processing JSON:', error);
      this.loading = false;
      alert('Error al procesar los datos JSON');
    }
  }

  filterByPriority(priority: string): void {
    this.filterPriority = priority;
    this.applyFilters();
  }

  searchLeads(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredLeads = this.leads.filter(lead => {
      const matchesPriority = this.filterPriority === 'all' || lead.priority === this.filterPriority;
      const matchesSearch = !this.searchTerm || 
        lead.Name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesPriority && matchesSearch;
    });
  }

  copyMessage(lead: ProcessedLead): void {
    const textarea = document.createElement('textarea');
    textarea.value = lead.personalizedMessage;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    alert(`Mensaje copiado para ${lead.Name}`);
  }

  openWhatsApp(lead: ProcessedLead): void {
    if (!lead.Phone || lead.Phone === 'N/A') {
      alert('Este lead no tiene número de teléfono');
      return;
    }

    // Limpiar el número de teléfono
    const cleanPhone = lead.Phone.replace(/\s/g, '').replace(/\+/g, '');
    const message = encodeURIComponent(lead.personalizedMessage);
    
    // Abrir WhatsApp Web
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Marcar como enviado
    lead.sent = true;
  }

  copyAndOpen(lead: ProcessedLead): void {
    this.copyMessage(lead);
    setTimeout(() => this.openWhatsApp(lead), 500);
  }

  getPriorityClass(priority: string): string {
    const classes: Record<string, string> = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return classes[priority] || '';
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return labels[priority] || priority;
  }

  exportToCSV(): void {
    const headers = ['Nombre', 'Teléfono', 'Paquete', 'Servicios IA', 'Presupuesto', 'Prioridad', 'Mensaje'];
    const rows = this.filteredLeads.map(lead => [
      lead.Name,
      lead.Phone,
      lead.recommendedPackage,
      lead.recommendedServices.join(', '),
      lead.estimatedBudget,
      this.getPriorityLabel(lead.priority),
      `"${lead.personalizedMessage.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_procesados_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStatistics() {
    return {
      total: this.leads.length,
      high: this.leads.filter(l => l.priority === 'high').length,
      medium: this.leads.filter(l => l.priority === 'medium').length,
      low: this.leads.filter(l => l.priority === 'low').length,
      sent: this.leads.filter(l => l.sent).length,
      withPhone: this.leads.filter(l => l.Phone && l.Phone !== 'N/A').length
    };
  }
}
