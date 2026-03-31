import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {

  private placesService = inject(PlacesService);
  places = this.placesService.loadedUserPlaces;
    private destroyRef = inject(DestroyRef);
    isFetching = signal(false);
    error = signal('');
  
    ngOnInit(){
      this.isFetching.set(true);
      const subscription = this.placesService.loadUserPlaces('http://localhost:3000/user-places', 'Something unexpeced happened while fetching the favorite places. Try again later')
      .subscribe({
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
      this.placesService.removePlaceFromUserPlaces(place)
        .subscribe()
    }
}
