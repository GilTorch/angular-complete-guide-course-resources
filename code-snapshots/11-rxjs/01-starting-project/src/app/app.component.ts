import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable,combineLatest } from 'rxjs'





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
   obs1 = interval(1000).pipe(map(x => `A${x}`));
   obs2 = interval(1500).pipe(map(x => `B${x}`));

  customInterval$ = new Observable((subscriber) => {
    let timeExecuted = 0;
   const interval = setInterval(() => {
      if(timeExecuted > 3){
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      timeExecuted++
      subscriber.next({ message: "new value", timeExecuted})
    },2000)
  });

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

  // this.customInterval$.subscribe({
  //   next: (val) => console.log(val),
  //   complete: () => console.log("COMPLETED!")
  // })

  // const subscription =  this.clickCount$.subscribe({
  //   next:() => console.log(`Clicked ${this.clickCount()} times. [RxJS]`)
  // })
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe()
    // })

    combineLatest([this.obs1, this.obs2]).subscribe(console.log);
  }

  onClick(){
    this.clickCount.update(c => c + 1);
  }

}
