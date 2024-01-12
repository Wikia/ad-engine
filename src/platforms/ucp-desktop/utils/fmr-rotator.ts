import {
	AdSlotEvent,
	AdSlotStatus,
	communicationService,
	context,
	eventsRepository,
	scrollListener,
	slotService,
	targetingService,
	universalAdPackage,
	utils,
	type BTRec,
} from '@wikia/ad-engine';

interface FmrRotatorConfig {
	topPositionToRun: number;
}

export class FmrRotator {
	private nextSlotName: string;
	private currentAdSlot = slotService.get(this.slotName);
	private recirculationElement: HTMLElement;
	private refreshInfo = {
		recSlotViewed: 2000,
		refreshDelay: utils.queryString.isUrlParamSet('fmr-debug') ? 2000 : 10000,
		startPosition: 0,
		positionTopToViewport: undefined,
		repeatIndex: 1,
		repeatLimit: 20,
	};
	private rotatorListener: string;

	constructor(
		private slotName: string,
		private fmrPrefix: string,
		private btRec: BTRec,
		private config: FmrRotatorConfig,
	) {}

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
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				if (slot.getSlotName().substring(0, this.fmrPrefix.length) === this.fmrPrefix) {
					if (
						universalAdPackage.isFanTakeoverLoaded() ||
						context.get('state.provider') === 'prebidium'
					) {
						communicationService.onSlotEvent(
							AdSlotStatus.STATUS_SUCCESS,
							() => {
								this.swapRecirculation(false);
							},
							slot.getSlotName(),
							true,
						);

						return;
					}

					communicationService.onSlotEvent(
						AdSlotStatus.STATUS_SUCCESS,
						() => {
							this.slotStatusChanged(AdSlotStatus.STATUS_SUCCESS);

							communicationService.onSlotEvent(
								AdSlotEvent.SLOT_VIEWED_EVENT,
								() => {
									const customDelays = context.get('options.rotatorDelay');
									setTimeout(() => {
										this.removeSlot();
									}, customDelays[slot.lineItemId] || this.refreshInfo.refreshDelay);
								},
								slot.getSlotName(),
								true,
							);
						},
						slot.getSlotName(),
						true,
					);

					communicationService.onSlotEvent(
						AdSlotStatus.STATUS_COLLAPSE,
						() => {
							this.slotStatusChanged(AdSlotStatus.STATUS_COLLAPSE);

							this.removeSlot();
						},
						slot.getSlotName(),
						true,
					);
				}
			},
			false,
		);

		setTimeout(() => {
			this.refreshInfo.startPosition =
				utils.getTopOffset(this.recirculationElement) -
				(document.querySelector('.fandom-sticky-header')?.clientHeight || 0);
			this.refreshInfo.positionTopToViewport =
				this.recirculationElement?.getBoundingClientRect()?.top;
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
			() => this.isInViewport() && this.isCorrectPositionReached(),
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

	private isCorrectPositionReached(): boolean {
		const isStickyOnTop = () => {
			if (!this.refreshInfo.positionTopToViewport || !this.config.topPositionToRun) {
				return false;
			}

			return this.refreshInfo.positionTopToViewport < this.config.topPositionToRun;
		};

		const isStartPositionReached = () => this.refreshInfo.startPosition <= window.scrollY;

		return isStartPositionReached() || isStickyOnTop();
	}

	private pushNextSlot(): void {
		utils.logger(
			'incontent_boxad_count',
			`repeatIndex/repeatLimit: ${this.refreshInfo.repeatIndex} / ${this.refreshInfo.repeatLimit}`,
		);
		context.push('state.adStack', { id: this.nextSlotName });
		this.refreshInfo.repeatIndex++;
	}

	private removeSlot(): void {
		if (!this.currentAdSlot) {
			return;
		}

		this.currentAdSlot.destroy();
		this.currentAdSlot.getElement().remove();
		this.swapRecirculation(true);
		setTimeout(() => {
			communicationService.emit(eventsRepository.ICB_SLOT_DESTROYED);

			this.scheduleNextSlotPush();
		}, 2000);
	}

	private slotStatusChanged(slotStatus: AdSlotStatus): void {
		this.currentAdSlot = slotService.get(this.nextSlotName);
		this.nextSlotName = 'incontent_boxad_2';

		if (slotStatus === AdSlotStatus.STATUS_SUCCESS) {
			this.swapRecirculation(false);
		}
	}

	private swapRecirculation(visible: boolean): void {
		this.recirculationElement.style.display = visible ? 'block' : 'none';
	}

	private callBidders(callback: () => void) {
		communicationService.emit(eventsRepository.BIDDERS_CALL_PER_GROUP, {
			group: 'incontent_boxad_2',
			callback: callback,
		});
	}

	private scheduleNextSlotPush(): void {
		if (this.isRefreshLimitAvailable()) {
			setTimeout(() => {
				this.callBidders(() => {
					this.tryPushNextSlot();
				});
			}, this.refreshInfo.refreshDelay);
		}
	}

	private isRefreshLimitAvailable(): boolean {
		return this.refreshInfo.repeatIndex <= this.refreshInfo.repeatLimit;
	}

	private tryPushNextSlot(): void {
		targetingService.set('icb_idx', this.refreshInfo.repeatIndex, this.nextSlotName);
		this.runNowOrOnScroll(this.isInViewport.bind(this), this.pushNextSlot.bind(this));
	}
}
