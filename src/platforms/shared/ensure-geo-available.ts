import { context, CookieStorageAdapter } from '@wikia/ad-engine';

interface GeoResponse {
	continent_code: string;
	country_code: string;
	region: string;
	city: string;
	country_name: string;
}

interface GeoData {
	continent: string;
	country: string;
	region: string;
}

export async function ensureGeoAvailable(): Promise<void> {
	if (window.ads?.geo !== undefined) {
		setUpGeoData(window.ads.geo);
		return;
	}

	const cookieAdapter = new CookieStorageAdapter();
	const geoCookie = cookieAdapter.getItem('Geo');

	if (geoCookie) {
		try {
			setUpGeoData(JSON.parse(decodeURIComponent(geoCookie)) || {});
			return;
		} catch (e) {
			throw new Error('Invalid JSON in the cookie');
		}
	}

	try {
		return getGeoData().then((geoData) => {
			cookieAdapter.setItem('Geo', encodeURIComponent(JSON.stringify(geoData)));
			setUpGeoData(geoData);
		});
	} catch (e) {
		// do nothing
	}
}

function setUpGeoData(geoData: GeoData) {
	context.set('geo.region', geoData.region);
	context.set('geo.country', geoData.country);
	context.set('geo.continent', geoData.continent);
}

function getGeoData(): Promise<GeoData> {
	const GEO_SERVICE_URL = 'https://services.fandom.com/geoip/location';

	return new Promise<GeoData>((resolve, reject) => {
		try {
			const request = new XMLHttpRequest();

			request.open('GET', GEO_SERVICE_URL, true);
			request.setRequestHeader('Content-type', 'application/json');
			request.timeout = 2000;
			request.withCredentials = true;

			request.onload = () => {
				if (request.status < 200 || request.status >= 300) {
					reject();
				} else {
					const geoResponse: GeoResponse = JSON.parse(request.responseText);

					resolve({
						continent: geoResponse.continent_code,
						country: geoResponse.country_code,
						region: geoResponse.region,
					});
				}
			};

			request.onerror = () => {
				reject();
			};

			request.send();
		} catch (err) {
			reject();
		}
	});
}
