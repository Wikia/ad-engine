import { expect } from 'chai';
import { timeouts } from './timeouts';

class Network {
	responses = [];
	listener = null;
	logs = [];

	constructor() {
		browser.addListener('Page.frameNavigated', ({ frame }) => {
			if (frame && !frame.parentId) {
				this.clearResponses();
				this.clearLogs();
			}
		});
	}

	enableCapturing(...responseFilters) {
		this.listener = (request) => {
			if (
				responseFilters.length === 0 ||
				responseFilters.some((filter) => request.response.url.includes(filter))
			) {
				this.responses.push(request.response);
			}
		};

		browser.cdp('Network', 'enable');
		browser.addListener('Network.responseReceived', this.listener);
	}

	disableCapturing() {
		browser.cdp('Network', 'disable');
		browser.removeListener('Network.responseReceived', this.listener);
		this.clearResponses();
		this.listener = null;
	}

	enableLogCapturing() {
		browser.cdp('Log', 'enable');
	}

	disableLogCapturing() {
		browser.cdp('Log', 'disable');
		this.clearLogs();
	}

	captureConsole() {
		browser.on('Log.entryAdded', (entry) => {
			this.logs.push(entry.entry);
		});
		browser.on('Console.messageAdded', (entry) => {
			this.logs.push(entry.message);
		});
	}

	returnConsole() {
		return this.logs;
	}

	clearResponses() {
		this.responses = [];
	}

	clearLogs() {
		this.responses = [];
	}

	filterResponses(...keys) {
		return this.responses.filter((response) => keys.every((key) => response.url.includes(key)));
	}

	waitForResponse(...keys) {
		if (!keys.length) {
			keys.push('');
		}

		browser.waitUntil(
			() => this.checkIfHasResponse(...keys),
			timeouts.standard,
			`No requests gathered for key: ${keys.join(', ')}`,
			timeouts.interval,
		);

		return this.filterResponses(...keys);
	}

	waitForFirstResponseUrl(...keys) {
		return this.waitForResponse(...keys).shift().url;
	}

	checkIfHasResponse(...keys) {
		return this.responses.some((response) => keys.every((key) => response.url.includes(key)));
	}

	checkIfMessageIsInLogs(key) {
		return this.logs.some((entry) => entry.text.includes(key));
	}

	getQueryValues(requestFilter, queryKey) {
		const response = this.filterResponses(requestFilter).shift();

		return this.getQueryValueFromUrl(response.url, queryKey);
	}

	getQueryValueFromUrl(url, queryKey) {
		const [, queryString] = url.split('?');
		const queryPairs = queryString.split('&');
		const queryParams = queryPairs.map((pair) => pair.split('='));
		const queryValue = queryParams.filter(([key]) => key === queryKey);

		if (queryValue.length) {
			if (typeof queryValue[0][1] === 'undefined') {
				return '';
			}

			return decodeURIComponent(queryValue[0][1]);
		}

		return null;
	}

	assertRequestsNumber(expectedRequests = 1, requests = this.responses) {
		expect(requests.length).to.equal(
			expectedRequests,
			`Found more requests than expected (found: ${requests.length})`,
		);
	}

	clearBrowserCache() {
		if (!browser.cdp('Network', 'canClearBrowserCache')) {
			console.warning('Cannot clear browser cache.');

			return;
		}
		browser.cdp('Network', 'clearBrowserCache');
		console.info('Cleared browser cache.');
	}
}

export const network = new Network();
