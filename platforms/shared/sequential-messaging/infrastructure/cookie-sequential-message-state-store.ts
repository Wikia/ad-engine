import { SequentialMessageState, SequentialMessageStateStore } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import Cookies from 'js-cookie';

const SEPARATOR = '|';
const RADIX = 36;

@Injectable()
export class CookieSequentialMessageStateStore implements SequentialMessageStateStore {
	static COOKIE_NAME = 'seqMsg';

	get(): SequentialMessageState {
		const cookie = Cookies.get(CookieSequentialMessageStateStore.COOKIE_NAME);
		if (!cookie) return undefined;

		const values = cookie.split(SEPARATOR);
		if (!values || values.length !== 4) return undefined;

		return {
			sequenceMessageId: values[0],
			sequenceNo: parseInt(values[1], RADIX) || 0,
			sequenceTimestamp: parseInt(values[2], RADIX) || 0,
			startedTimestamp: parseInt(values[3], RADIX) || 0,
		};
	}

	save(state: SequentialMessageState): void {
		const values = [
			state.sequenceMessageId,
			state.sequenceNo ? state.sequenceNo.toString(RADIX) : '0',
			state.sequenceTimestamp ? state.sequenceTimestamp.toString(RADIX) : '0',
			state.startedTimestamp ? state.startedTimestamp.toString(RADIX) : '0',
		];
		Cookies.set(CookieSequentialMessageStateStore.COOKIE_NAME, values.join(SEPARATOR));
	}
}
