import { utils } from '@wikia/ad-engine';
import { inject, injectable } from 'tsyringe';
import { F2Environment, F2_ENV } from '../setup-f2';

@injectable()
export class F2SrcAdapter {
	constructor(@inject(F2_ENV) private f2Env: F2Environment) {}

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
