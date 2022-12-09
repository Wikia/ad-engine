import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class CcnSlotsContextSetup implements DiProcess {
	execute(): void {
		const isMobile = context.get('state.isMobile');
		const desktopSlots = {
			'div-gpt-ad-headerad': {
				defaultSizes: [[728, 90]],
				targeting: {
					loc: 'top',
					pos: 'dlb1',
				},
			},
			'div-gpt-ad-hero': {
				defaultSizes: [[300, 250]],
				targeting: {
					loc: 'middle',
					pos: 'dmr4',
				},
			},
			'div-gpt-ad-abovecontent': {
				defaultSizes: [[468, 60]],
				targeting: {
					loc: 'middle',
					pos: 'dlb2',
				},
			},
			'div-gpt-ad-catsidebar': {
				defaultSizes: [[300, 250]],
				targeting: {
					loc: 'middle',
					pos: 'dmr4',
				},
			},
		};
		const mobileSlots = {
			'div-gpt-ad-headerad': {
				defaultSizes: [[320, 50]],
				targeting: {
					loc: 'top',
					pos: 'mlb1',
				},
			},
			'div-gpt-ad-hero': {
				defaultSizes: [[300, 250]],
				targeting: {
					loc: 'middle',
					pos: 'mmr4',
				},
			},
			'div-gpt-ad-abovecontent': {
				defaultSizes: [[320, 50]],
				targeting: {
					loc: 'middle',
					pos: 'mlb5',
				},
			},
			'div-gpt-ad-catsidebar': {
				defaultSizes: [[300, 250]],
				targeting: {
					loc: 'bottom',
					pos: 'mmr4',
				},
			},
			'div-gpt-ad-anchorad': {
				defaultSizes: [[320, 50]],
				targeting: {
					loc: 'bottom',
					pos: 'mlb3',
				},
			},
		};

		context.set('slots', isMobile ? mobileSlots : desktopSlots);
	}
}
