import { Component, input } from '@angular/core';

import { Course } from '../../Models/course.model';

@Component({
  selector: 'tms-course-card',
  standalone: true,
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent {
  course = input.required<Course>();

  get availableSeats() {
    return Math.max(this.course().maxCapacity - this.course().enrollmentCount, 0);
  }
}
