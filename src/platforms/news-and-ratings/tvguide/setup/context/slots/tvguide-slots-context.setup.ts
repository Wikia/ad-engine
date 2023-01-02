import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			'nav-ad-plus': {
				defaultSizes: [[5, 5]],
				targeting: {
					pos: 'nav',
				},
			},
			'omni-skybox-leader-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'omni-skybox-leaderboard-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'omni-skybox-sticky': {
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'omni-leader-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'omni-leaderboard-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'incontent-ad-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'top',
				},
			},
			'incontent-ad-plus-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'middle',
				},
			},
			'incontent-ad-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			'leader-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			'leader-inc': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'leader-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos: 'middle',
				},
			},
			'leader-middle2': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos: 'middle2',
				},
			},
			'leader-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			'leader-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			'leaderboard-top': {
				defaultSizes: [[728, 90]],
				targeting: {
					pos: 'top',
				},
			},
			'leaderboard-middle': {
				defaultSizes: [[728, 90]],
				incremental: true,
				targeting: {
					pos: 'middle',
				},
			},
			'leaderboard-middle2': {
				defaultSizes: [[728, 90]],
				incremental: true,
				targeting: {
					pos: 'middle2',
				},
			},
			'leaderboard-inc': {
				defaultSizes: [[728, 90]],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'leaderboard-bottom': {
				defaultSizes: [[728, 90]],
				targeting: {
					pos: 'bottom',
				},
			},
			'incontent-leader-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'middle',
				},
			},
			'incontent-leader-inc': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-leader-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'top',
				},
			},
			'incontent-leader-plus-inc': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-leader-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'incontent-leaderboard-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			'incontent-leaderboard-middle': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos: 'middle',
				},
			},
			'incontent-leaderboard-inc': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-leaderboard-bottom': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'mpu-plus-top': {
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			'mpu-top': {
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			'mpu-middle': {
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: 'middle',
				},
			},
			'mpu-bottom': {
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'masthead-button-inc': {
				defaultSizes: [[270, 100]],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-nav-ad-plus': {
				defaultSizes: [
					[7, 7],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-omni-skybox-plus-sticky': {
				defaultSizes: [
					[6, 6],
					[320, 50],
					[5, 5],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'mobile-omni-plus-sticky': {
				defaultSizes: [
					[6, 6],
					[320, 50],
				],
				targeting: {
					pos: 'sticky',
				},
			},
			'mobile-mpu': {
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
			'mobile-banner-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
			'mobile-banner-plus-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-incontent-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
			'mobile-incontent-plus-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-incontent-plus-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-masthead-button-inc': {
				defaultSizes: [[270, 100]],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [
					[5, 5],
					[320, 50],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-incontent-mpu-plus': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
				],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
			'incontent-all-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			'mobile-incontent-all': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
			'mobile-incontent-mpu-plus-inc': {
				defaultSizes: [
					[300, 250],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-narrow-all-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			'video-rectangle': {
				defaultSizes: [[640, 480]],
				lazyLoad: false,
				incremental: false,
				isVideo: true,
			},
		};

		context.set('slots', slots);
	}
}
