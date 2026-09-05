import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root'
})
export class LiveSyncService {
  private readonly platformId = inject(PLATFORM_ID);
  private connection: HubConnection | null = null;
  private readonly eventsSubject = new Subject<EnrollmentStatusEvent>();

  // Expose as an observable stream for EnrollmentStore
  readonly events$ = this.eventsSubject.asObservable();

  // Reactive connection state signal for UI status feedback
  readonly connectionState = signal<'connected' | 'reconnecting' | 'disconnected'>('disconnected');

  connect(): void {
    if (this.connection) return;

    // Guard against running in SSR/Node.js context
    if (!isPlatformBrowser(this.platformId)) return;

    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/tms')
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    // Event name must match the ITmsHubClient method from backend
    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (enrollmentId: string, status: 'Pending' | 'Approved' | 'Rejected') => {
        this.eventsSubject.next({ id: enrollmentId, status });
      }
    );

    this.connection.onreconnecting(() => this.connectionState.set('reconnecting'));
    this.connection.onreconnected(() => this.connectionState.set('connected'));
    this.connection.onclose(() => this.connectionState.set('disconnected'));

    this.connection
      .start()
      .then(() => this.connectionState.set('connected'))
      .catch(err => console.error('SignalR connection error:', err));
  }
}