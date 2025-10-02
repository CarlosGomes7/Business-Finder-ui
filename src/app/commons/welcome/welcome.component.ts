import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  imports: [FormsModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  standalone: true
})

export class WelcomeComponent {
code: string = '';
isValid: boolean = false;
error: string = '';

constructor(private router: Router) {}

  handleSubmit(): void {
    const trimmedCode = this.code.trim();
    
    if (trimmedCode.length === 0) {
      this.error = 'Por favor ingresa un código';
      this.isValid = false;
      return;
    }
    
    if (trimmedCode.length < 6) {
      this.error = 'El código debe tener al menos 6 caracteres';
      this.isValid = false;
      return;
    }

    this.error = '';
    this.isValid = true;
    
    // Aquí iría tu lógica de autenticación real
    if (trimmedCode === 'HECHOS:4-12') {
      // Redirigir a la página principal
      this.router.navigate(['/home']);    
    } else {
      this.error = 'Código inválido. Inténtalo de nuevo.';
      this.isValid = false;
      return;
    }
   
  }

  onCodeChange(): void {
    this.error = '';
    this.isValid = false;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  requestAccess(): void {
    window.open('https://api.whatsapp.com/send?phone=51965458988&text=%E2%9C%A8%20Hola!%20Te%20damos%20la%20bienvenida%20desde%20System-137%20%F0%9F%99%8C.%0AEn%20breve%20atenderemos%20tu%20solicitud%20para%20generar%20tu%20clave%20de%20acceso%20a%20Business-Finder%20%F0%9F%94%91.%0A%C2%A1Gracias%20por%20confiar%20en%20nosotros%2C%20estamos%20felices%20de%20ayudarte%20a%20conectar%20tu%20negocio%20con%20m%C3%A1s%20oportunidades!%20%F0%9F%9A%80', '_blank');
  }
}
