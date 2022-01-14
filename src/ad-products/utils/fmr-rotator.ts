import {
	AdSlot,
	context,
	events,
	eventService,
	scrollListener,
	slotService,
	utils,
} from '@ad-engine/core';
import { universalAdPackage } from '../templates/uap';

export class FmrRotator {
	private nextSlotName: string;
	private currentAdSlot: AdSlot;
	private recirculationElement: HTMLElement;
	private refreshInfo = {
		recSlotViewed: 2000,
		refreshDelay: utils.queryString.isUrlParamSet('fmr-debug') ? 2000 : 10000,
		startPosition: 0,
	};
	private rotatorListener: string;

	constructor(private slotName: string, private fmrPrefix: string, private btRec) {}

	rotateSlot(): void {
		this.nextSlotName = this.slotName;
		this.recirculationElement = document.querySelector(
			context.get(`slots.${this.slotName}.recirculationElementSelector`),
		);

		if (this.btRec?.isEnabled()) {
			this.initializeBTRotation();
		} else {
			this.initializeStandardRotation();
		}
	}

	private initializeStandardRotation(): void {
		eventService.on(events.AD_SLOT_CREATED, (slot: AdSlot) => {
			if (slot.getSlotName().substring(0, this.fmrPrefix.length) === this.fmrPrefix) {
				if (
					universalAdPackage.isFanTakeoverLoaded() ||
					context.get('state.provider') === 'prebidium'
				) {
					slot.once(AdSlot.STATUS_SUCCESS, () => {
						this.swapRecirculation(false);
					});

					return;
				}

				slot.once(AdSlot.STATUS_SUCCESS, () => {
					this.slotStatusChanged(AdSlot.STATUS_SUCCESS);

					slot.once(AdSlot.SLOT_VIEWED_EVENT, () => {
						const customDelays = context.get('options.rotatorDelay');
						setTimeout(() => {
							this.hideSlot();
						}, customDelays[slot.lineItemId] || this.refreshInfo.refreshDelay);
					});
				});

				slot.once(AdSlot.STATUS_COLLAPSE, () => {
					this.slotStatusChanged(AdSlot.STATUS_COLLAPSE);
					this.scheduleNextSlotPush();
				});
			}
		});

		setTimeout(() => {
			this.refreshInfo.startPosition =
				utils.getTopOffset(this.recirculationElement) -
				(document.querySelector('.fandom-sticky-header')?.clientHeight || 0);
			this.startFirstRotation();
		}, this.refreshInfo.refreshDelay);
	}

	private initializeBTRotation(): void {
		this.pushNextSlot();

		let recirculationVisible = false;

		setInterval(() => {
			this.swapRecirculation(recirculationVisible);
			recirculationVisible = !recirculationVisible;
		}, this.refreshInfo.refreshDelay + this.refreshInfo.recSlotViewed);
	}

	private startFirstRotation(): void {
		this.runNowOrOnScroll(
			() => this.isInViewport() && this.isStartPositionReached(),
			this.pushNextSlot.bind(this),
		);
	}

	private runNowOrOnScroll(condition, callback): void {
		if (condition()) {
			this.removeScrollListener();
			callback();
		} else if (!this.rotatorListener) {
			this.rotatorListener = scrollListener.addCallback(() =>
				this.runNowOrOnScroll(condition.bind(this), callback.bind(this)),
			);
		}
	}

	private removeScrollListener(): void {
		if (this.rotatorListener) {
			scrollListener.removeCallback(this.rotatorListener);
			this.rotatorListener = null;
		}
	}

	private isInViewport(): boolean {
		const recirculationElementInViewport = utils.isInViewport(this.recirculationElement);
		const adSlotInViewport =
			this.currentAdSlot &&
			this.currentAdSlot.getElement() &&
			utils.isInViewport(this.currentAdSlot.getElement());

		return recirculationElementInViewport || adSlotInViewport;
	}

	private isStartPositionReached(): boolean {
		return this.refreshInfo.startPosition <= window.scrollY;
	}

	private pushNextSlot(): void {
		context.push('state.adStack', { id: this.nextSlotName });
	}

	private hideSlot(): void {
		if (context.get('options.floatingMedrecDestroyable')) {
			slotService.remove(this.currentAdSlot);
		} else {
			this.currentAdSlot.hide();
		}

		this.swapRecirculation(true);
		this.scheduleNextSlotPush();
	}

	private slotStatusChanged(slotStatus): void {
		this.currentAdSlot = slotService.get(this.nextSlotName);
		this.nextSlotName = this.fmrPrefix + (this.currentAdSlot.getConfigProperty('repeat.index') + 1);

		if (slotStatus === AdSlot.STATUS_SUCCESS) {
			this.swapRecirculation(false);
		}
	}

	private swapRecirculation(visible): void {
		this.recirculationElement.style.display = visible ? 'block' : 'none';
	}

	private scheduleNextSlotPush(): void {
		if (this.isRefreshLimitAvailable()) {
			setTimeout(() => {
				this.tryPushNextSlot();
			}, this.refreshInfo.refreshDelay);
		}
	}

	private isRefreshLimitAvailable(): boolean {
		return (
			this.currentAdSlot &&
			this.currentAdSlot.getConfigProperty('repeat.index') <
				this.currentAdSlot.getConfigProperty('repeat.limit')
		);
	}

	private tryPushNextSlot(): void {
		this.runNowOrOnScroll(this.isInViewport.bind(this), this.pushNextSlot.bind(this));
	}
}
