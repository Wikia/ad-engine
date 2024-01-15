import {
	AdSlotStatus,
	communicationService,
	context,
	eventsRepository,
	scrollListener,
	utils,
} from '@wikia/ad-engine';

interface RotatorConfig {
	topPositionToRun: number;
}

export class BasicRotator {
	private rotatorListener: string;
	private slotContainer: HTMLElement;
	private refreshInfo = {
		recSlotViewed: 2000,
		refreshDelay: utils.queryString.isUrlParamSet('fmr-debug') ? 2000 : 10000,
		startPosition: 0,
		positionTopToViewport: undefined,
		repeatIndex: 1,
		repeatLimit: 20,
		refreshInterval: 30000,
	};

	constructor(
		private slotName: string,
		private slotNamePrefix: string,
		private config: RotatorConfig,
	) {
		this.slotContainer = document.querySelector(`#${this.slotName}`);
	}

	rotateSlot(): void {
		communicationService.on(
			eventsRepository.AD_ENGINE_SLOT_ADDED,
			({ slot }) => {
				if (slot.getSlotName().substring(0, this.slotNamePrefix.length) !== this.slotNamePrefix) {
					return;
				}

				communicationService.onSlotEvent(
					AdSlotStatus.STATUS_SUCCESS,
					() => {
						setTimeout(() => {
							slot.destroy();
							slot.getElement().remove();
							this.pushNextSlot();
						}, this.refreshInfo.refreshInterval);
					},
					slot.getSlotName(),
					true,
				);
			},
			false,
		);

		this.startFirstRotation();
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

	private isInViewport(): boolean {
		return utils.isInViewport(this.slotContainer);
	}

	private removeScrollListener(): void {
		if (this.rotatorListener) {
			scrollListener.removeCallback(this.rotatorListener);
			this.rotatorListener = null;
		}
	}

	private pushNextSlot(): void {
		context.push('state.adStack', { id: `${this.slotNamePrefix}${this.refreshInfo.repeatIndex}` });
		this.refreshInfo.repeatIndex++;
	}
}
