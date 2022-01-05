import { utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../setup-f2';

@Injectable()
export class F2SrcAdapter {
	constructor(@Inject(F2_ENV) private f2Env: F2Environment) {}

	/**
	 * Return src targeting parameter based on current env
	 */
	getSrcBasedOnEnv(): string {
		let src = 'ns';
		const adMirrorSrc = this.getAdMirrorSrc(window.location.hostname);
		const overwriteSrc = utils.queryString.get('overwriteadmirror') ?? '';

		if (this.f2Env.isAdMirror && adMirrorSrc !== 'test') {
			src = adMirrorSrc;
		} else if (!this.f2Env.isProduction && overwriteSrc) {
			src = overwriteSrc;
		} else if (!this.f2Env.isProduction || adMirrorSrc === 'test') {
			src = 'test';
		}

		return src;
	}

	/**
	 * Return src targeting parameter based on current ad mirror
	 */
	private getAdMirrorSrc(hostname): string {
		const adMirrorsSrc = {
			'adeng.fandom.wikia.com': 'test',
			'www.showcase.fandom.com': 'showcase',
			'www.externaltest.fandom.com': 'externaltest',
		};

		return adMirrorsSrc[hostname] ? adMirrorsSrc[hostname] : '';
	}
}
