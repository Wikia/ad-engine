import type * as Sentry from '@sentry/browser';
import type { BrowserClientOptions } from '@sentry/browser/types/client';

declare global {
	interface Window {
		Sentry?: typeof Sentry;
	}
}

interface SentryOptions {
	dsn: BrowserClientOptions['dsn'];
	release: BrowserClientOptions['release'];
	environment: BrowserClientOptions['environment'];
	sampleRate: number;
}

export class SentryLoader {
	private static ALLOWED_URLS = [
		'fandom.com',
		'futhead.com',
		'gamespot.com',
		'giantbomb.com',
		'metacritic.com',
		'muthead.com',
		'tvguide.com',
	];

	private static SENTRY_SCRIPT_CDN_URL = '//browser.sentry-cdn.com/7.105.0/bundle.min.js';
	private static SENTRY_SCRIPT_INTEGRITY =
		'sha384-iP5xIlbkWonIse3OwYtwpMAWScjrivRx8HUwVQK36MIK1LWXNF4oaIysvubyRK9V';

	private tags: Record<string, string> = {};
	private readonly errorQueue: Error[] = [];
	private scope: Sentry.Scope | undefined;
	private loadPromise: Promise<void>;

	constructor(private readonly options: SentryOptions) {}

	get inserted(): boolean {
		return Array.from(document.getElementsByTagName('script')).some(
			(script: HTMLScriptElement) => script.src === SentryLoader.SENTRY_SCRIPT_CDN_URL,
		);
	}

	get shouldLoad(): boolean {
		return (
			Math.random() < this.options.sampleRate &&
			SentryLoader.ALLOWED_URLS.find((url) => window.location.hostname.includes(url)) !== undefined
		);
	}

	get loaded(): boolean {
		return window.Sentry !== undefined;
	}

	get initialized(): boolean {
		return this.scope !== undefined;
	}

	setTags(tags: Record<string, string>): void {
		this.tags = {
			...this.tags,
			...tags,
		};
	}

	captureException(error: Error): void {
		console.error(
			`[AE] (${this.options.release} ${this.options.environment}) Error captured:`,
			error,
		);

		if (this.options.environment === 'development') {
			return;
		}

		if (!this.shouldLoad) {
			return;
		}

		if (!this.inserted) {
			this.errorQueue.push(error);
			this.loadSentry();
			return;
		}

		if (!this.loaded) {
			this.errorQueue.push(error);
			this.loadSentry();
			return;
		}

		if (!this.initialized) {
			this.createSentryInstance();
		}

		this.scope.captureException(error);
	}

	private loadSentry(): Promise<void> {
		if (this.loadPromise === undefined) {
			this.loadPromise = new Promise((resolve) => {
				const script: HTMLScriptElement = document.createElement('script');
				script.defer = true;
				script.src = SentryLoader.SENTRY_SCRIPT_CDN_URL;
				script.crossOrigin = 'anonymous';
				script.integrity = SentryLoader.SENTRY_SCRIPT_INTEGRITY;
				script.onload = () => {
					this.createSentryInstance();
					this.flushErrorQueue();
					resolve();
				};

				const temp = document.getElementsByTagName('script')[0];

				temp.parentNode.append(script);
			});
		}

		return this.loadPromise;
	}

	private createSentryInstance(): void {
		const {
			breadcrumbsIntegration,
			BrowserClient,
			dedupeIntegration,
			defaultStackParser,
			httpContextIntegration,
			linkedErrorsIntegration,
			makeFetchTransport,
			Scope,
		} = window.Sentry;
		const options: BrowserClientOptions = {
			...this.options,
			sampleRate: 1.0,
			transport: makeFetchTransport,
			stackParser: defaultStackParser,
			integrations: [
				breadcrumbsIntegration(),
				dedupeIntegration(),
				httpContextIntegration(),
				linkedErrorsIntegration(),
			],
		};
		const client = new BrowserClient(options);
		this.scope = new Scope();
		this.scope.setClient(client);
		this.scope.setTags({
			url: window.location.href,
			userAgent: window.navigator.userAgent,
			...this.tags,
		});
	}

	private flushErrorQueue() {
		this.errorQueue.forEach((error) => this.scope?.captureException(error));
	}
}
