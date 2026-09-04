export interface Course {
  id: string;
  code: string;
  title: string;
  maxCapacity: number;
  enrollmentCount: number;
}

export interface CourseDetail extends Course {
  description?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}