import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-base-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [TranslateModule],
})
/**
 * Component displaying the About Statement
 */
export class AboutComponent {

  private baseUrl = window.location.origin; // Base URL for the charts, can be configured as needed

  charts: { title: string; url: SafeResourceUrl }[] = [
    { title: 'Por año de publicación',      url: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseUrl}/charts/anio.html`) },
    { title: 'Por tipo',     url: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseUrl}/charts/type.html`) },
    { title: 'Por área de investigación',  url: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseUrl}/charts/subject.html`) },
    /** { title: 'Tipo Completo',url: this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseUrl}/charts/type_full.html`) }*/
  ];

  constructor(private sanitizer: DomSanitizer) {}
}