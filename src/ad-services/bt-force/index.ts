import { context, utils } from '@ad-engine/core';
import { trackBab } from '../../platforms/shared';

const logGroup = 'bt-force-loader';
type BTDetail = { detail: { ab: boolean } };
/**
 * BT service handler
 */
class BTForce {
	/**
	 * Runs BT force service and injects code
	 */
	async run(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		this.btDetectionEvents();
		this.insertSideUnits();

		utils.logger(logGroup, 'loading');
		await this.loadScript();
	}

	btDetectionEvents() {
		// BTAADetection event - tells us that BT finished Ad Blocker check on their side
		// detail.ab : boolean - ad block detected
		const handleDetectionEvent = (e: BTDetail & CustomEvent) => {
			if (e.detail.ab) {
				utils.logger(logGroup, 'BTAADetection - AdBlock detected');
				trackBab(true, 'bt');
			} else {
				trackBab(false, 'bt');
			}
			window.removeEventListener('BTAADetection', handleDetectionEvent);
		};
		window.addEventListener('BTAADetection', handleDetectionEvent);

		// AcceptableAdsInit event - tells us that BT is trying to recover ads now
		const handleRecoveryEvent = (e: CustomEvent) => {
			if (e.detail) {
				utils.logger(logGroup, 'AcceptableAdsInit');
			}
			window.removeEventListener('AcceptableAdsInit', handleRecoveryEvent);
		};
		window.addEventListener('AcceptableAdsInit', handleRecoveryEvent);
	}

	/**
	 * Checks if BT force is enabled
	 */
	isEnabled(): boolean {
		return context.get('options.wad.btForce');
	}

	/**
	 * Injects BT script
	 */
	private loadScript(): Promise<Event> {
		const btLibraryUrl = 'https://btloader.com/tag?o=5199505043488768&upapi=true';
		return utils.timedPartnerScriptLoader.loadScriptWithStatus(
			btLibraryUrl,
			logGroup,
			true,
			'first',
		);
	}

	private insertSideUnits(): void {
		if (
			context.get('state.isMobile') ||
			document.body.classList.contains('is-content-expanded') ||
			document.documentElement.classList.contains('is-content-expanded')
		) {
			return;
		}

		const containerMaxWidth = 1236;
		const minSideAdWidth = 90;
		const sideUnitsCalculatedPadding = 60;
		const globalNavigationWidth = 66;
		const sideContainersSpace =
			2 * minSideAdWidth + globalNavigationWidth + sideUnitsCalculatedPadding;
		const resizableContainer = document.querySelector('.page.has-right-rail, .mainpage .page');

		if (
			!resizableContainer ||
			(window.document.body.scrollWidth || 0) < containerMaxWidth + sideContainersSpace
		) {
			return;
		}

		const sideBTleft = document.createElement('div');
		const sideBTright = document.createElement('div');

		sideBTleft.className = 'side-bt-container left';
		sideBTright.className = 'side-bt-container right';

		resizableContainer.prepend(sideBTleft, sideBTright);

		const wrapperLeft = document.createElement('div');
		const wrapperRight = document.createElement('div');

		wrapperLeft.id = 'btbgleft';
		wrapperRight.id = 'btbgright';

		sideBTleft.append(wrapperLeft);
		sideBTright.append(wrapperRight);
	}
}

export const btForce = new BTForce();
