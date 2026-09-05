import { Component, viewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { EnrollmentStore } from '../../store/enrollment.store';
import { Enrollment } from '../../Models/enrollment.model';

@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.scss'
})
export class EnrollmentListComponent {
  readonly store = inject(EnrollmentStore);

  displayedColumns: string[] = ['studentName', 'courseName', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>();

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.entities();
    });

    effect(() => {
      this.dataSource.paginator = this.paginator();
      this.dataSource.sort = this.sort();
    });

    this.store.loadEnrollments();
  }

  onApprove(id: string): void {
    this.store.updateStatusOptimistic({ id, status: 'Approved' });
  }

  onReject(id: string): void {
    this.store.updateStatusOptimistic({ id, status: 'Rejected' });
  }

  dismissError(): void {
    this.store.clearError();
  }
}