import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  readonly store = inject(EnrollmentStore);

  ngOnInit(): void {
    this.store.loadEnrollments();
  }

  onApprove(id: string): void {
    this.store.approveEnrollment(id);
  }
}