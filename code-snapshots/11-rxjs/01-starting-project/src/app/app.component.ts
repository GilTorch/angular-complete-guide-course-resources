import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount)
  interval$ = interval(1000)
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  // constructor(){
  //   effect(() => {
  //     console.log(`Clicked ${this.clickCount()} times.`)
  //   })
  // }

  ngOnInit(): void {
  //  const subscription =  interval(1000).pipe(
  //   map((val) => val*2)
  //  ).subscribe({
  //     next: (val) => console.log(val),
  //     complete: () => {},
  //     error: () => {}
  //   });

  const subscription =  this.clickCount$.subscribe({
    next:() => console.log(`Clicked ${this.clickCount()} times. [RxJS]`)
  })
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe()
    })
  }

  onClick(){
    this.clickCount.update(c => c + 1);
  }

}
