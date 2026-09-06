import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { exhaustMap, finalize } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GradeService, GradePayload } from '../../services/grade';
import { HasUnsavedChanges } from '../../guards/pending-changes.guard';

@Component({
  selector: 'tms-grade-submission',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './grade-submission.html',
  styleUrls: ['./grade-submission.scss']
})
export class GradeSubmissionComponent implements HasUnsavedChanges {
  private readonly api = inject(GradeService);
  private readonly fb = inject(FormBuilder);

  readonly gradeForm = this.fb.group({
    studentId: [101, [Validators.required, Validators.min(1)]],
    courseId: [302, [Validators.required, Validators.min(1)]],
    score: [88, [Validators.required, Validators.min(0), Validators.max(100)]]
  });

  readonly isSubmitting = signal(false);
  readonly submissionStatus = signal('');

  private readonly submitClick$ = new Subject<GradePayload>();

  constructor() {
    this.submitClick$
      .pipe(
        exhaustMap((payload) => {
          this.isSubmitting.set(true);
          this.submissionStatus.set('Submitting grade to server...');

          return this.api.postGrade(payload).pipe(
            finalize(() => {
              this.isSubmitting.set(false);
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (result) => {
          this.gradeForm.markAsPristine();
          this.submissionStatus.set(`Grade saved successfully! Record ID: ${result.id}`);
        },
        error: (err) => {
          this.submissionStatus.set(`Submission failed: ${err.message || 'Server error'}`);
        }
      });
  }

  hasUnsavedChanges(): boolean {
    return this.gradeForm.dirty && !this.isSubmitting();
  }

  onSubmit(): void {
    // 1. Guard against clicks while a request is actively processing
    if (this.isSubmitting()) {
      console.warn('Click dropped: submission currently in flight');
      return;
    }

    // 2. Validate form
    if (this.gradeForm.invalid) {
      this.gradeForm.markAllAsTouched();
      this.submissionStatus.set('Please fix form errors before submitting.');
      return;
    }

    const rawValue = this.gradeForm.getRawValue();
    this.submitClick$.next({
      studentId: Number(rawValue.studentId),
      courseId: Number(rawValue.courseId),
      score: Number(rawValue.score)
    });
  }
}