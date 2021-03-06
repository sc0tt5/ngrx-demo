import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  concatMap,
  catchError,
  first,
  map,
  mergeMap,
  switchMap
} from 'rxjs/operators';

import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { EntityState } from '../reducers';

import * as HeroActions from '../actions';
import { Hero } from '../../core';
import { HeroDataService, DataServiceError } from '../services';

const filterAction = new HeroActions.GetHeroes();
const toAction = HeroActions.toAction();
type HeroAction = HeroActions.HeroAction;

@Injectable()
export class HeroEffects {
  @Effect()
  getHeroes$: Observable<Action> = this.actions$
    .ofType(HeroActions.GET_HEROES)
    .pipe(
      switchMap(() =>
        toAction(
          this.heroDataService.getHeroes(),
          HeroActions.GetHeroesSuccess,
          HeroActions.GetHeroesError
        )
      )
    );

  @Effect()
  addHero$: Observable<Action> = this.actions$
    .ofType(HeroActions.ADD_HERO)
    .pipe(
      concatMap((action: HeroAction) =>
        toAction(
          this.heroDataService.addHero(action.payload),
          HeroActions.AddHeroSuccess,
          HeroActions.AddHeroError
        )
      )
    );

  @Effect()
  deleteHero$: Observable<Action> = this.actions$
    .ofType(HeroActions.DELETE_HERO)
    .pipe(
      concatMap((action: HeroAction) =>
        toAction(
          this.heroDataService.deleteHero(action.payload),
          HeroActions.DeleteHeroSuccess,
          HeroActions.DeleteHeroError
        )
      )
    );

  @Effect()
  updateHero$: Observable<Action> = this.actions$
    .ofType<HeroActions.UpdateHero>(HeroActions.UPDATE_HERO)
    .pipe(
      concatMap((action: HeroAction) =>
        toAction(
          this.heroDataService.updateHero(action.payload),
          HeroActions.UpdateHeroSuccess,
          HeroActions.UpdateHeroError
        )
      )
    );

  constructor(
    private store: Store<EntityState>,
    private actions$: Actions,
    private heroDataService: HeroDataService
  ) {}
}
