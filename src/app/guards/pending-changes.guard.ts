import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean | Observable<boolean>;
}

export const pendingChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component && typeof component.hasUnsavedChanges === 'function') {
    if (component.hasUnsavedChanges()) {
      return confirm('You have unsaved changes. Are you sure you want to navigate away?');
    }
  }
  return true;
};
