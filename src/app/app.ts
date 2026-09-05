import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from './store/enrollment.store';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('tms-client');
  private readonly enrollmentStore = inject(EnrollmentStore);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.enrollmentStore.listenForLiveUpdates();
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}