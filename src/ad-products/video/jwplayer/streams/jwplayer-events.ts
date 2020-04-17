import { ValuesOf } from '@ad-engine/core';
import { JWPlayerEventParams, JWPlayerNoParamEvent } from '../external-types/jwplayer';

export type JwpEventKey = keyof JWPlayerEventParams | JWPlayerNoParamEvent | 'init' | 'lateReady';

export interface JwpNamedEvent<TEvent extends JwpEventKey> {
	name: TEvent;
}

export const jwpEvents = [
	'init',
	'lateReady',
	'adRequest',
	'adError',
	'adImpression',
	'adBlock',
	'adsManager',
	'beforePlay',
	'videoMidPoint',
	'beforeComplete',
	'complete',
	'ready',
	'adClick',
	'adStarted',
	'adViewableImpression',
	'adFirstQuartile',
	'adMidPoint',
	'adThirdQuartile',
	'adComplete',
	'adSkipped',
	'videoStart',
	'error',
] as const;

export type JwpEventName = ValuesOf<typeof jwpEvents>;
