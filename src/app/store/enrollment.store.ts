import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState,
} from '@ngrx/signals';
import {
  withEntities,
  setAllEntities,
  updateEntity,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, concatMap, tap, catchError, EMPTY } from 'rxjs';
import { EnrollmentService } from '../services/enrollment';
import { Enrollment } from '../Models/enrollment.model';

export const EnrollmentStore = signalStore(
  { providedIn: 'root' },
  // Pillar 1: Base state flags
  withState({ isLoading: false, error: null as string | null }),

  // O(1) Dictionary storage ({ ids: string[], entityMap: Record<string, Enrollment> })
  withEntities<Enrollment>(),

  // Pillar 2: Computed derived signals
  withComputed((store) => ({
    pendingCount: computed(
      () => store.entities().filter((e) => e.status === 'Pending').length
    ),
  })),

  // Pillar 3: Methods via rxMethod + RxJS streams
  withMethods((store, api = inject(EnrollmentService)) => ({
    loadEnrollments: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        concatMap(() =>
          api.getAll().pipe(
            tap((rows) =>
              patchState(store, setAllEntities(rows), { isLoading: false })
            ),
            catchError((err) => {
              patchState(store, {
                isLoading: false,
                error: err.message ?? 'Failed to load enrollments',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    approveEnrollment: rxMethod<string>(
      pipe(
        tap((id) => {
          // 1. Optimistic Update: instantly set status to "Approved"
          patchState(
            store,
            updateEntity({ id, changes: { status: 'Approved' } })
          );
        }),
        concatMap((id) =>
          api.approve(id).pipe(
            catchError((err) => {
              // 2. Rollback on failure: revert status back to "Pending"
              patchState(
                store,
                updateEntity({ id, changes: { status: 'Pending' } })
              );
              patchState(store, {
                error:
                  'Server rejected the approval. Check enrollment constraints.',
              });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);