import { Injectable } from '@wikia/dependency-injection';
import { animationFrameScheduler, fromEvent, Observable } from 'rxjs';
import { observeOn, publish, refCount } from 'rxjs/operators';

type FromEventTarget<T> = Parameters<typeof fromEvent>[0];

@Injectable()
export class DomListener {
	readonly scroll$: Observable<Event> = this.createSource(document, 'scroll');
	readonly resize$: Observable<Event> = this.createSource(window, 'resize');

	private createSource<T>(target: FromEventTarget<T>, eventName: string): Observable<T> {
		return fromEvent(target, eventName).pipe(
			observeOn(animationFrameScheduler), // scheduler to ensure smooth animation
			publish(), // so that only one listener is created
			refCount(), // so that listener is deleted when no subscriptions
		);
	}
}
