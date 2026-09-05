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
import { pipe, concatMap, switchMap, tap, catchError, EMPTY } from 'rxjs';
import { EnrollmentService } from '../services/enrollment';
import { LiveSyncService, EnrollmentStatusEvent } from '../services/live-sync';
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
    approvedCount: computed(
      () => store.entities().filter((e) => e.status === 'Approved').length
    ),
    rejectedCount: computed(
      () => store.entities().filter((e) => e.status === 'Rejected').length
    ),
  })),

  // Pillar 3: Methods via rxMethod + RxJS streams
  withMethods((store, api = inject(EnrollmentService), sync = inject(LiveSyncService)) => ({
    clearError(): void {
      patchState(store, { error: null });
    },

    listenForLiveUpdates: rxMethod<void>(
      (trigger$) =>
        trigger$.pipe(
          tap(() => sync.connect()),
          switchMap(() => sync.events$),
          tap((event: EnrollmentStatusEvent) => {
            patchState(
              store,
              updateEntity({ id: event.id, changes: { status: event.status } })
            );
          })
        )
    ),

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
                error: err.message || 'Failed to load enrollments',
              });
              return EMPTY;
            })
          )
        )
      )
    ),

    // Module 10 Session 3: Full-Stack Optimistic Update with Automatic Rollback
    updateStatusOptimistic: rxMethod<{ id: string; status: 'Pending' | 'Approved' | 'Rejected' }>(
      pipe(
        concatMap(({ id, status }) => {
          const currentEntity = store.entityMap()[id];
          if (!currentEntity) return EMPTY;

          const previousStatus = currentEntity.status;

          // Step 1: Immediate Optimistic Update in SignalStore
          patchState(
            store,
            updateEntity({ id, changes: { status } }),
            { error: null }
          );

          // Step 2: Dispatch API Request
          return api.updateStatus(id, status).pipe(
            catchError((err) => {
              // Step 3: Optimistic Rollback on Server Error
              console.warn(`[Optimistic Rollback] Reverting enrollment #${id} to ${previousStatus}`);
              patchState(
                store,
                updateEntity({ id, changes: { status: previousStatus } }),
                { error: err.message || `Rollback: Could not update enrollment status.` }
              );
              return EMPTY;
            })
          );
        })
      )
    )
  }))
);