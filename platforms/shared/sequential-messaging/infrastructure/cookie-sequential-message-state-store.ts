import { SequentialMessageState, SequentialMessageStateStore } from '@wikia/ad-engine';
import Cookies from 'js-cookie';

export const COOKIE_NAME = 'seqMsg';
const SEPARATOR = '|';
const RADIX = 36;

export class CookieSequentialMessageStateStore implements SequentialMessageStateStore {
	get(): SequentialMessageState {
		const cookie = Cookies.get(COOKIE_NAME);
		if (!cookie) return undefined;

		const values = cookie.split(SEPARATOR);
		if (!values || values.length !== 4) return undefined;

		return {
			sequenceMessageId: values[0],
			sequenceNo: parseInt(values[1], RADIX),
			sequenceTimestamp: parseInt(values[2], RADIX),
			startedTimestamp: parseInt(values[3], RADIX),
		};
	}

	save(state: SequentialMessageState): void {
		const values = [
			state.sequenceMessageId,
			state.sequenceNo ? state.sequenceNo.toString(RADIX) : '0',
			state.sequenceTimestamp ? state.sequenceTimestamp.toString(RADIX) : '0',
			state.startedTimestamp ? state.startedTimestamp.toString(RADIX) : '0',
		];
		Cookies.set(COOKIE_NAME, values.join(SEPARATOR));
	}
}
