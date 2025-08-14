import { ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { productService } from '../../../services/productService';
import {
  fetchProductsCommand,
  addProductCommand,
  updateProductCommand,
  deleteProductCommand,
  productsFetchedEvent,
  productAddedEvent,
  productUpdatedEvent,
  productDeletedEvent,
  productsErrorEvent,
} from './productsSlice';
import type { Product } from '../../../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchProductsEpic = (action$: any) =>
  action$.pipe(
    ofType(fetchProductsCommand.type),
    switchMap(() =>
      from(productService.fetchProducts()).pipe(
        map((products: Product[]) => productsFetchedEvent(products)),
        catchError((error) => of(productsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addProductEpic = (action$: any) =>
  action$.pipe(
    ofType(addProductCommand.type),
    switchMap((action: ReturnType<typeof addProductCommand>) =>
      from(productService.addProduct(action.payload)).pipe(
        map((product: Product) => productAddedEvent(product)),
        catchError((error) => of(productsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateProductEpic = (action$: any) =>
  action$.pipe(
    ofType(updateProductCommand.type),
    switchMap((action: ReturnType<typeof updateProductCommand>) =>
      from(productService.updateProduct(action.payload)).pipe(
        map((product: Product) => productUpdatedEvent(product)),
        catchError((error) => of(productsErrorEvent(error.message)))
      )
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteProductEpic = (action$: any) =>
  action$.pipe(
    ofType(deleteProductCommand.type),
    switchMap((action: ReturnType<typeof deleteProductCommand>) =>
      from(productService.deleteProduct(action.payload)).pipe(
        map(() => productDeletedEvent(action.payload)),
        catchError((error) => of(productsErrorEvent(error.message)))
      )
    )
  );

export const productsEpics = [
  fetchProductsEpic,
  addProductEpic,
  updateProductEpic,
  deleteProductEpic,
];