import { Container } from '@wikia/dependency-injection';
import { PlatformPipeline } from './platform-pipeline';

const container = new Container();
const platform = container.get(PlatformPipeline);
platform.execute();
