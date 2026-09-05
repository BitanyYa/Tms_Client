import { Component, inject, OnInit, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { EnrollmentStore } from './store/enrollment.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('tms-client');
  private readonly enrollmentStore = inject(EnrollmentStore);

  ngOnInit(): void {
    this.enrollmentStore.listenForLiveUpdates();
  }
}