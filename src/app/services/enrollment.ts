import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Enrollment } from '../Models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly http = inject(HttpClient);
  // Match your backend port if running (5036)
  private readonly baseUrl = 'http://localhost:5036/api/enrollments';

  private readonly fallbackEnrollments: Enrollment[] = [
    { id: '1', studentId: 101, studentName: 'Liya Kebede', courseId: 1, courseName: 'CS-101: Intro to CS', status: 'Pending', enrolledAt: new Date().toISOString() },
    { id: '2', studentId: 102, studentName: 'Dawit Getachew', courseId: 2, courseName: 'CS-201: Data Structures', status: 'Pending', enrolledAt: new Date().toISOString() },
    { id: '3', studentId: 103, studentName: 'Abeba Bikila', courseId: 1, courseName: 'CS-101: Intro to CS', status: 'Approved', enrolledAt: new Date().toISOString() },
    { id: '4', studentId: 104, studentName: 'Yonas Tesfaye', courseId: 3, courseName: 'MAT-101: Calculus I', status: 'Approved', enrolledAt: new Date().toISOString() },
    { id: '5', studentId: 105, studentName: 'Sara Mengistu', courseId: 2, courseName: 'CS-201: Data Structures', status: 'Rejected', enrolledAt: new Date().toISOString() },
    { id: '6', studentId: 106, studentName: 'Biruk Hailu', courseId: 1, courseName: 'CS-101: Intro to CS', status: 'Pending', enrolledAt: new Date().toISOString() },
    { id: '7', studentId: 107, studentName: 'Hellen Tadesse', courseId: 3, courseName: 'MAT-101: Calculus I', status: 'Pending', enrolledAt: new Date().toISOString() },
    { id: '8', studentId: 108, studentName: 'Natnael Assefa', courseId: 2, courseName: 'CS-201: Data Structures', status: 'Approved', enrolledAt: new Date().toISOString() },
    { id: '9', studentId: 109, studentName: 'Kalkidan Girma', courseId: 1, courseName: 'CS-101: Intro to CS', status: 'Pending', enrolledAt: new Date().toISOString() },
    { id: '10', studentId: 110, studentName: 'Ephrem Alemu', courseId: 3, courseName: 'MAT-101: Calculus I', status: 'Approved', enrolledAt: new Date().toISOString() },
    { id: '11', studentId: 111, studentName: 'Selamawit Desta', courseId: 1, courseName: 'CS-101: Intro to CS', status: 'Pending', enrolledAt: new Date().toISOString() },
    { id: '12', studentId: 112, studentName: 'Tewodros Kassahun', courseId: 2, courseName: 'CS-201: Data Structures', status: 'Approved', enrolledAt: new Date().toISOString() }
  ];

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.baseUrl).pipe(
      catchError(() => {
        // Returns the mock data so the app displays correctly
        return of(this.fallbackEnrollments);
      })
    );
  }

  approve(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/approve`, {}).pipe(
      catchError(() => of(void 0))
    );
  }
}