import { context } from './../../services/context-service';
import { getAdapters } from './adapters-registry';

const lazyLoadSlots = [
	'BOTTOM_LEADERBOARD'
];

function isSlotAvailable(code, lazyLoad = 'off') {
	let available = true;
	const isSlotLazy = lazyLoadSlots.indexOf(code) !== -1;

	if (lazyLoad !== 'off' && ((lazyLoad === 'pre' && isSlotLazy) || (lazyLoad === 'post' && !isSlotLazy))) {
		available = false;
	}

	return available;
}

export function setupAdUnits(adaptersConfig) {
	const adUnits = [];
	const adapters = getAdapters(adaptersConfig);

	adapters.forEach((adapter) => {
		if (adapter && adapter.enabled) {
			const adapterAdUnits = adapter.prepareAdUnits();

			adapterAdUnits.forEach((adUnit) => {
				if (adUnit && isSlotAvailable(adUnit.code)) {
					adUnits.push(adUnit);
				}
			});
		}
	});

	return adUnits;
}

export function getTargeting(slotName) {
	const provider = context.get('state.isMobile') ? 'mobile' : 'gpt',
		s1 = context.get('targeting.wikiIsTop1000') ? context.get('targeting.s1') : 'not a top1k wiki';

	return {
		pos: [slotName],
		src: [provider],
		s0: [context.get('targeting.s0') || ''],
		s1: [s1],
		s2: [context.get('targeting.s2') || ''],
		lang: [context.get('targeting.wikiLanguage') || 'en']
	};
}
