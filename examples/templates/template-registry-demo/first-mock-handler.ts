import { Context, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class FirstMockHandler implements TemplateStateHandler {
	private id = Math.random() * 10;
	private destroy$ = new Subject();

	constructor(private context: Context) {
		(window as any).gcTest.set(this, 'FirstMockHandler');
	}

	async onEnter(transition: TemplateTransition<'second'>): Promise<void> {
		console.log(`first mock handler (${this.id}) enter`);
		console.log(this.context.get('src'));
		timer(2000)
			.pipe(
				tap(() => transition('second')),
				takeUntil(this.destroy$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		console.log(`first mock handler (${this.id}) leave`);
		console.log('#########################');
	}

	async onDestroy(): Promise<void> {
		console.log(`first mock handler (${this.id}) destroy`);
		console.log('#########################');
		this.destroy$.next();
		this.destroy$.complete();
	}
}
