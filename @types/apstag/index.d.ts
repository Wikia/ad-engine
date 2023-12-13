import type { ApstagConfig, ApstagTokenConfig } from '@wikia/ad-bidders/a9/types';

interface Apstag {
	_Q: any[];
	init?: (config: ApstagConfig) => unknown;
	rpa?: (config: ApstagTokenConfig) => void;
	upa?: (config: ApstagTokenConfig) => void;
	dpa?: () => void;
	fetchBids?: (...args: any[]) => unknown;
	targetingKeys?: () => string[];
	debug?: (cmd: 'enable' | 'disable') => void;
	renderImp?: (...args: any[]) => void;
}
