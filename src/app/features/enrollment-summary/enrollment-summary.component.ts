import { Component, inject } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';

@Component({
  selector: 'tms-enrollment-summary',
  standalone: true,
  template: `
    <div class="summary-box">
      <h3>Pending Approvals</h3>
      <p class="badge">{{ store.pendingCount() }}</p>
    </div>
  `
})
export class EnrollmentSummaryComponent {
  readonly store = inject(EnrollmentStore);
}