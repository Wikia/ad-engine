import { utils } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import process from 'process';
import { ensureGeoCookie } from '../ensure-geo-cookie';
import { SentryLoader } from './sentry-loader';

function getSampleRate() {
	return utils.geoService.getCountryCode() === 'US' ? 0.01 : 0.1;
}

export async function withSentry(wrapped: (container: Container) => void): Promise<void> {
	const container = new Container();
	await ensureGeoCookie();
	const sampleRate = getSampleRate();
	const sentry = new SentryLoader({
		dsn: process.env.SENTRY_DSN,
		release: process.env.APP_VERSION,
		environment: process.env.NODE_ENV,
		sampleRate,
	});
	sentry.setTags({
		'geo.country': utils.geoService.getCountryCode(),
		'geo.continent': utils.geoService.getContinentCode(),
		'geo.region': utils.geoService.getRegionCode(),
	});
	container.bind(SentryLoader).value(sentry);
	try {
		wrapped(container);
	} catch (e) {
		sentry.captureException(e);
	}
}
