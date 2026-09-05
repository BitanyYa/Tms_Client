import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { LoginRequest, UserProfileDto } from '../Models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/auth';

  // Identity State management via Signals
  readonly user = signal<UserProfileDto | null>(null);
  readonly isAuthenticated = computed(() => !!this.user());
  readonly isLoaded = signal<boolean>(false);

  constructor() {
    this.fetchProfile().subscribe();
  }

  login(credentials: LoginRequest): Observable<UserProfileDto> {
    return this.http.post<UserProfileDto>(`${this.baseUrl}/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((profile) => {
        this.user.set(profile);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.user.set(null);
      }),
      catchError(() => {
        this.user.set(null);
        return of(void 0);
      })
    );
  }

  fetchProfile(): Observable<UserProfileDto | null> {
    return this.http.get<UserProfileDto>(`${this.baseUrl}/me`, {
      withCredentials: true
    }).pipe(
      tap((profile) => {
        this.user.set(profile);
        this.isLoaded.set(true);
      }),
      catchError(() => {
        this.user.set(null);
        this.isLoaded.set(true);
        return of(null);
      })
    );
  }

  fetchXsrfToken(): Observable<void> {
    return this.http.get<void>(`${this.baseUrl}/xsrf-token`, {
      withCredentials: true
    });
  }
}
