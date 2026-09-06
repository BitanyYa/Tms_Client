import { Injectable, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly sanitizer = inject(DomSanitizer);

  sanitizeHtml(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }

  sanitizeUrl(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.URL, value) || '';
  }

  bypassSecurityTrustHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }

  bypassSecurityTrustUrl(value: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

  stripScriptTags(input: string): string {
    if (!input) return '';
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
}
