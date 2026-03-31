import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient);
  private errorService = inject(ErrorService);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces(url: string, error: string) {
    return this.httpClient.get<{ places: Place[]}>(url)
        .pipe(
          map((data) => data.places),
          catchError((error) => {
            console.error(error);
            return throwError(
              () => new Error(error)
            )
          })
        )
  }

  loadUserPlaces(url: string, error: string) {
     return this.httpClient.get<{ places: Place[]}>(url)
        .pipe(
          tap({
            next: ({ places}) => this.userPlaces.set(places)
          }),
          map((data) => data.places),
          catchError((error) => {
            console.error(error);
            return throwError(
              () => new Error(error)
            )
          })
        )
  }

  addPlaceToUserPlaces(place: Place) {
    const previousPlaces = this.userPlaces()

    if(!previousPlaces.some(p => p.id)){
      this.userPlaces.set([...previousPlaces, place])
    }

    return this.httpClient.put("http://localhost:3000/user-places",{
      placeId: place.id
    })
    .pipe(
      catchError(error => {
        this.errorService.showError('Failed to store selected place');
        this.userPlaces.update(prevPlaces => [...previousPlaces])
        return throwError(() => new Error('Failed to store selected place'))
      })
    )
  } 

  removePlaceFromUserPlaces(place: Place) {
    const previousPlaces = this.userPlaces()

    if(previousPlaces.some(p => p.id)){

      this.userPlaces.set([...previousPlaces.filter(p => p.id !== place.id)])
    }

    return this.httpClient.delete(`http://localhost:3000/user-places/${place.id}`)
    .pipe(
      catchError(error => {
        this.errorService.showError('Failed to delete selected place');
        this.userPlaces.set([...previousPlaces])
        return throwError(() => new Error('Failed to delete selected place'))
      })
    )
  } 

}
