import { Container } from '@wikia/dependency-injection';
import { PlatformPipeline } from './platform-pipeline';

const url = new URL(
	document.currentScript
		? (document.currentScript as HTMLScriptElement).src
		: 'http://localhost:9000/main.bundle.js',
);
console.log('XXX', url.href.replace(/([\w-]+\/)?main\.bundle\.js$/, ''));
// @ts-expect-error Webpack Public URL override
__webpack_public_path__ = url.href.replace(/([\w-]+\/)?main\.bundle\.js$/, '');

const container = new Container();
const platform = container.get(PlatformPipeline);
platform.execute();
