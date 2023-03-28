import { context, DiProcess } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class TvGuideA9ConfigSetup implements DiProcess {
	execute(): void {
		context.set('bidders.a9.slots', this.getA9Context());
	}

	private getA9Context(): object {
		const desktopSlots = {
			'omni-skybox-leader-sticky': {
				sizes: [[728, 90]],
			},
			'omni-skybox-leaderboard-sticky': {
				sizes: [[728, 90]],
			},
			'omni-leader-sticky': {
				sizes: [[728, 90]],
			},
			'omni-leaderboard-sticky': {
				sizes: [[728, 90]],
			},
			'incontent-ad-plus-top': {
				sizes: [[728, 90]],
			},
			'incontent-ad-plus-middle': {
				sizes: [[728, 90]],
			},
			'incontent-ad-plus-bottom': {
				sizes: [[728, 90]],
			},
			'leader-top': {
				sizes: [[728, 90]],
			},
			'leader-inc': {
				sizes: [[728, 90]],
			},
			'leader-middle': {
				sizes: [[728, 90]],
			},
			'leader-middle2': {
				sizes: [[728, 90]],
			},
			'leader-plus-top': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'leader-plus-bottom': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'leaderboard-top': {
				sizes: [[728, 90]],
			},
			'leaderboard-middle': {
				sizes: [[728, 90]],
			},
			'leaderboard-middle2': {
				sizes: [[728, 90]],
			},
			'leaderboard-inc': {
				sizes: [[728, 90]],
			},
			'leaderboard-bottom': {
				sizes: [[728, 90]],
			},
			'incontent-leader-middle': {
				sizes: [[728, 90]],
			},
			'incontent-leader-inc': {
				sizes: [[728, 90]],
			},
			'incontent-leader-plus-top': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'incontent-leader-plus-inc': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'incontent-leader-plus-bottom': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'incontent-leaderboard-top': {
				sizes: [[728, 90]],
			},
			'incontent-leaderboard-middle': {
				sizes: [[728, 90]],
			},
			'incontent-leaderboard-inc': {
				sizes: [[728, 90]],
			},
			'incontent-leaderboard-bottom': {
				sizes: [[728, 90]],
			},
			'mpu-plus-top': {
				sizes: [
					[300, 250],
					[300, 600],
				],
			},
			'mpu-top': {
				sizes: [[300, 250]],
			},
			'mpu-middle': {
				sizes: [[300, 250]],
			},
			'mpu-bottom': {
				sizes: [[300, 250]],
			},
			video: {
				type: 'video',
			},
		};

		const mobileSlots = {
			'mobile-omni-skybox-plus-sticky': {
				sizes: [[320, 50]],
			},
			'mobile-omni-plus-sticky': {
				sizes: [[320, 50]],
			},
			'mobile-mpu': {
				sizes: [[300, 250]],
			},
			'mobile-banner-plus': {
				sizes: [[300, 250]],
			},
			'mobile-banner-plus-inc': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'mobile-incontent-plus': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'mobile-incontent-plus-bottom': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'mobile-incontent-plus-inc': {
				sizes: [
					[300, 250],
					[320, 50],
				],
			},
			'mobile-nav-ad-plus-banner': {
				sizes: [[320, 50]],
			},
			'mobile-incontent-mpu-plus': {
				sizes: [[300, 250]],
			},
			'incontent-all-top': {
				sizes: [
					[728, 90],
					[970, 250],
				],
			},
			'mobile-incontent-all': {
				sizes: [[300, 250]],
			},
			'mobile-incontent-mpu-plus-inc': {
				sizes: [[300, 250]],
			},
			'incontent-narrow-all-top': {
				sizes: [[728, 90]],
			},
			video: {
				type: 'video',
			},
		};

		return context.get('state.isMobile') ? mobileSlots : desktopSlots;
	}
}
