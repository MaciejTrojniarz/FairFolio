import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { fetchCostCategoriesCommand, costCategoriesFetchedEvent, costCategoriesErrorEvent, addCostCategoryCommand, costCategoryAddedEvent } from './costCategoriesSlice';
import { costCategoryService } from '../../../services/costCategoryService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchCostCategoriesEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchCostCategoriesCommand.type),
    switchMap(() =>
      from(costCategoryService.fetchCostCategories()).pipe(
        map((cats) => costCategoriesFetchedEvent(cats)),
        catchError((error) => of(costCategoriesErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addCostCategoryEpic = (action$: any) =>
  action$.pipe(
    ofType(addCostCategoryCommand.type),
    switchMap((action: ReturnType<typeof addCostCategoryCommand>) =>
      from(costCategoryService.addCostCategory(action.payload)).pipe(
        map((cat) => costCategoryAddedEvent(cat)),
        catchError((error) => of(costCategoriesErrorEvent(error.message)))
      )
    )
  );

export const costCategoriesEpics = [fetchCostCategoriesEpic, addCostCategoryEpic];
