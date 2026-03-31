import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  private placesServices = inject(PlacesService)
  private destroyRef = inject(DestroyRef);
  isFetching = signal(false);
  error = signal('');

  ngOnInit(){
    this.isFetching.set(true);
    const subscription = this.placesServices.loadAvailablePlaces('http://localhost:3000/places','Something unexpected happened while fetching the available places. Try again later')
    .subscribe({
      next: (places) => this.places.set(places),
      complete: () => {
        this.isFetching.set(false);
      },
      error: (error: Error) => {
        this.isFetching.set(false);
        this.error.set(error.message);
      }
    })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onSelectPlace(place: Place){
    this.placesServices.addPlaceToUserPlaces(place).subscribe({
      next: () => {},
      complete: () => {},
      error: () => {}
    })
  }
}
