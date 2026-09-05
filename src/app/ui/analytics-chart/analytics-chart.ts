import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../Models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  template: `
    <div class="chart-container">
      <h3>Enrollment Analytics</h3>
      <div class="chart-bars">
        <div class="bar-col">
          <div class="bar approved" [style.height.px]="approvedHeight()"></div>
          <span class="label">Approved ({{ approvedCount() }})</span>
        </div>
        <div class="bar-col">
          <div class="bar pending" [style.height.px]="pendingHeight()"></div>
          <span class="label">Pending ({{ pendingCount() }})</span>
        </div>
        <div class="bar-col">
          <div class="bar rejected" [style.height.px]="rejectedHeight()"></div>
          <span class="label">Rejected ({{ rejectedCount() }})</span>
        </div>
      </div>
      <p class="chart-summary">
        Total records: {{ data().length }}
      </p>
    </div>
  `,
  styleUrl: './analytics-chart.scss'
})
export class AnalyticsChartComponent {
  readonly data = input.required<Enrollment[]>();

  readonly approvedCount = computed(() => this.data().filter(e => e.status === 'Approved').length);
  readonly pendingCount = computed(() => this.data().filter(e => e.status === 'Pending').length);
  readonly rejectedCount = computed(() => this.data().filter(e => e.status === 'Rejected').length);

  readonly approvedHeight = computed(() => Math.max(30, this.approvedCount() * 25));
  readonly pendingHeight = computed(() => Math.max(30, this.pendingCount() * 25));
  readonly rejectedHeight = computed(() => Math.max(30, this.rejectedCount() * 25));
}