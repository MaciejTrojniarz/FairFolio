import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap } from 'rxjs/operators';
import { type PayloadAction } from '@reduxjs/toolkit';
import { categoryService } from '../../../services/categoryService';
import { showToast } from '../ui/uiSlice';
import type { Category } from '../../../types';
import {
  fetchCategoriesCommand,
  addCategoryCommand,
  updateCategoryCommand,
  deleteCategoryCommand,
  categoriesFetchedEvent,
  categoryAddedEvent,
  categoryUpdatedEvent,
  categoryDeletedEvent,
  categoriesErrorEvent,
} from './categoriesSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchCategoriesEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchCategoriesCommand.type),
    switchMap(() =>
      from(categoryService.fetchCategories()).pipe(
        map((categories) => categoriesFetchedEvent(categories)),
        catchError((error) => of(categoriesErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(addCategoryCommand.type),
    mergeMap((action: PayloadAction<string>) =>
      from(categoryService.addCategory(action.payload)).pipe(
        mergeMap((category) => of(
          categoryAddedEvent(category),
          showToast({ message: 'Category added successfully!', severity: 'success' })
        )),
        catchError((error) => of(
          categoriesErrorEvent(error.message),
          showToast({ message: `Error adding category: ${error.message}`, severity: 'error' })
        ))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(updateCategoryCommand.type),
    mergeMap((action: PayloadAction<Category>) =>
      from(categoryService.updateCategory(action.payload)).pipe(
        mergeMap((category) => of(
          categoryUpdatedEvent(category),
          showToast({ message: 'Category updated successfully!', severity: 'success' })
        )),
        catchError((error) => of(
          categoriesErrorEvent(error.message),
          showToast({ message: `Error updating category: ${error.message}`, severity: 'error' })
        ))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteCategoryCommand.type),
    mergeMap((action: PayloadAction<string>) =>
      from(categoryService.deleteCategory(action.payload)).pipe(
        mergeMap(() => of(
          categoryDeletedEvent(action.payload),
          showToast({ message: 'Category deleted successfully!', severity: 'success' })
        )),
        catchError((error) => of(
          categoriesErrorEvent(error.message),
          showToast({ message: `Error deleting category: ${error.message}`, severity: 'error' })
        ))
      )
    )
  );

export const categoriesEpics = [
  fetchCategoriesEpic,
  addCategoryEpic,
  updateCategoryEpic,
  deleteCategoryEpic,
];