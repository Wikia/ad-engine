import { eventsRepository } from '@ad-engine/communication';
import { context } from '../services';
import { docLoadedWithTtlPromise, domContentLoadedWithTtlPromise } from './browser-phase-promise';
import { waitForEventPromise } from './wait-for-event-promise';

const DEFAULT_WAIT_FOR_DOM_CONTENT_LOADED_TTL = 500;
const DEFAULT_FIRST_WAIT_FOR_PAGE_LOAD_TTL = 1000;
const DEFAULT_SECOND_FOR_PAGE_LOAD_TTL = 1500;

const DEFAULT_WAIT_FOR_AD_STACK_START_TIMEOUT = 2000;

export const AdEngineInitialPhase: Promise<void> = domContentLoadedWithTtlPromise(
	context.get('options.phases.domContentLoadedTimeout') || DEFAULT_WAIT_FOR_DOM_CONTENT_LOADED_TTL,
);

export const AdEngineConfigurationPhase: Promise<void> = docLoadedWithTtlPromise(
	context.get('options.phases.pageLoadedTimeout') || DEFAULT_FIRST_WAIT_FOR_PAGE_LOAD_TTL,
);

export const AdEnginePartnersPhase: Promise<void> = docLoadedWithTtlPromise(
	context.get('options.phases.beforePageLoadedTimeout') || DEFAULT_SECOND_FOR_PAGE_LOAD_TTL,
);

export const AdEngineStackStartPhase: Promise<void> = waitForEventPromise(
	eventsRepository.AD_ENGINE_STACK_START,
	context.get('options.phases.adEngineStackStartTimeout') ||
		DEFAULT_WAIT_FOR_AD_STACK_START_TIMEOUT,
);
