import { AdSlot, TEMPLATE, TemplateStateHandler, TemplateTransition } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DomManipulator } from '../../helpers/manipulators/dom-manipulator';

@Injectable({ autobind: false })
export class SlotTransitionIhiHandler implements TemplateStateHandler {
	private unsubscribe$ = new Subject<void>();

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot, private manipulator: DomManipulator) {}

	async onEnter(transition: TemplateTransition<'hidden'>): Promise<void> {
		this.animate()
			.pipe(
				tap(() => {
					transition('hidden');
				}),
				takeUntil(this.unsubscribe$),
			)
			.subscribe();
	}

	private animate(): Observable<unknown> {
		const height: number = this.adSlot.getElement().offsetHeight;
		const slideOutTime = 600;
		const fadeInTime = 400;
		const slotHideTime = 1000;

		this.manipulator
			.element(this.adSlot.getElement())
			.setProperty(
				'transition',
				`bottom ${slideOutTime}ms cubic-bezier(0.55, 0.055, 0.675, 0.19), ` +
					`opacity ${fadeInTime}ms cubic-bezier(0.55, 0.055, 0.675, 0.19)`,
			)
			.setProperty('opacity', '0')
			.setProperty('bottom', `-${height}px`);

		return timer(slotHideTime);
	}

	async onLeave(): Promise<void> {
		this.unsubscribe$.next();
	}
}
