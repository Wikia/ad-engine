import {
	AdSlot,
	Dictionary,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Injectable({ autobind: false })
export class SecondMockHandler implements TemplateStateHandler {
	private id = Math.random() * 10;
	private destroy$ = new Subject();

	constructor(
		@Inject(TEMPLATE.PARAMS) private params: Dictionary,
		@Inject(TEMPLATE.SLOT) private slot: AdSlot,
	) {
		(window as any).gcTest.set(this, 'SecondMockHandler');
	}

	async onEnter(transition: TemplateTransition<'first'>): Promise<void> {
		console.log(`second mock handler (${this.id}) enter`);
		console.log(this.params, this.slot);
		timer(2000)
			.pipe(
				tap(() => transition('first')),
				takeUntil(this.destroy$),
			)
			.subscribe();
	}

	async onLeave(): Promise<void> {
		console.log(`second mock handler (${this.id}) leave`);
		console.log('#########################');
	}

	async onDestroy(): Promise<void> {
		console.log(`second mock handler (${this.id}) destroy`);
		console.log('#########################');
		this.destroy$.next();
		this.destroy$.complete();
	}
}
