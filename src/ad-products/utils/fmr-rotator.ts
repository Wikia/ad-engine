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
import { NavbarManager } from './navbar-manager';

export class FmrRotator {
	private btRecStatus = false;
	private nextSlotName: string;
	private currentAdSlot: AdSlot;
	private recirculationElement: HTMLElement;
	private refreshInfo = {
		recSlotViewed: 2000,
		refreshDelay: 10000,
		refreshLimit: 20,
		startPosition: 0,
	};
	private navbarManager = new NavbarManager(document.getElementById('globalNavigation'));
	private rotatorListener: string;
	private recSelector: string;
	private currentRecNode: HTMLElement;

	constructor(private slotName: string, private fmrPrefix: string, private btRec) {}

	rotateSlot(): void {
		this.nextSlotName = this.slotName;
		this.recirculationElement = document.getElementById('recirculation-rail');
		this.refreshInfo.startPosition =
			utils.getTopOffset(this.recirculationElement) - this.navbarManager.getHeight();
		this.btRecStatus = this.btRec.isEnabled();

		eventService.on(events.AD_SLOT_CREATED, (slot) => {
			if (slot.getSlotName().substring(0, this.fmrPrefix.length) === this.fmrPrefix) {
				slot.once(AdSlot.STATUS_SUCCESS, () => {
					this.slotStatusChanged(AdSlot.STATUS_SUCCESS);
					slot.once(AdSlot.SLOT_VIEWED_EVENT, () => {
						setTimeout(() => {
							this.hideSlot();
						}, this.refreshInfo.refreshDelay);
					});
				});

				slot.once(AdSlot.STATUS_COLLAPSE, () => {
					this.slotStatusChanged(AdSlot.STATUS_COLLAPSE);
					this.scheduleNextSlotPush();
				});
			}
		});

		setTimeout(() => {
			this.startFirstRotation();
		}, this.refreshInfo.refreshDelay);
	}

	private slotStatusChanged(slotStatus): void {
		if (universalAdPackage.isFanTakeoverLoaded()) {
			this.swapRecirculation(false);

			return;
		}

		if (!this.btRecStatus) {
			this.currentAdSlot = slotService.get(this.nextSlotName);
			this.nextSlotName =
				this.fmrPrefix + (this.currentAdSlot.getConfigProperty('repeat.index') + 1);
		}

		if (slotStatus === AdSlot.STATUS_SUCCESS) {
			this.swapRecirculation(false);
		}
	}

	private swapRecirculation(visible): void {
		this.recirculationElement.style.display = visible ? 'block' : 'none';
	}

	private removeScrollListener(): void {
		if (this.rotatorListener) {
			scrollListener.removeCallback(this.rotatorListener);
			this.rotatorListener = null;
		}
	}

	private hideSlot(): void {
		if (this.btRecStatus) {
			this.removeRecNode();
		} else if (!universalAdPackage.isFanTakeoverLoaded()) {
			if (context.get('options.floatingMedrecDestroyable')) {
				eventService.emit(events.AD_SLOT_DESTROY_TRIGGERED, this.currentAdSlot.getSlotName());
			} else {
				this.currentAdSlot.hide();
			}
		}

		this.swapRecirculation(true);
		this.scheduleNextSlotPush();
	}

	private removeRecNode(): void {
		const recNode = (document.querySelector(this.recSelector) ||
			this.currentRecNode) as HTMLElement;

		if (recNode) {
			recNode.style.setProperty('display', 'none');
			recNode.remove();
		}
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
			this.btRecStatus ||
			(this.currentAdSlot &&
				this.currentAdSlot.getConfigProperty('repeat.index') < this.refreshInfo.refreshLimit)
		);
	}

	private tryPushNextSlot(): void {
		this.runNowOrOnScroll(this.isInViewport.bind(this), this.pushNextSlot.bind(this));
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

	private isInViewport(): boolean {
		const recirculationElementInViewport = utils.isInViewport(this.recirculationElement);
		const btRecNodeInViewport =
			this.btRecStatus && this.currentRecNode && utils.isInViewport(this.currentRecNode);
		const adSlotInViewport =
			this.currentAdSlot &&
			this.currentAdSlot.getElement() &&
			utils.isInViewport(this.currentAdSlot.getElement());

		return recirculationElementInViewport || btRecNodeInViewport || adSlotInViewport;
	}

	private pushNextSlot(): void {
		context.push('state.adStack', { id: this.nextSlotName });

		this.applyRec(() => {
			this.slotStatusChanged(AdSlot.STATUS_SUCCESS);
			setTimeout(() => {
				this.hideSlot();
			}, this.refreshInfo.recSlotViewed + this.refreshInfo.refreshDelay);
		});
	}

	private applyRec(onSuccess): void {
		if (!this.btRecStatus) {
			return;
		}

		if (this.recSelector === null) {
			this.recSelector = `div[id*="${this.btRec.getPlacementId(this.nextSlotName)}"]`;
		}

		this.currentRecNode = this.btRec.duplicateSlot(this.nextSlotName) as HTMLElement;

		if (this.currentRecNode) {
			this.btRec.triggerScript();
		}

		if (onSuccess) {
			onSuccess();
		}

		this.currentRecNode = (document.querySelector(this.recSelector) ||
			this.currentRecNode) as HTMLElement;
	}

	private startFirstRotation(): void {
		this.runNowOrOnScroll(
			() => this.isInViewport() && this.isStartPositionReached(),
			this.pushNextSlot.bind(this),
		);
	}

	private isStartPositionReached(): boolean {
		return this.refreshInfo.startPosition <= window.scrollY;
	}
}
