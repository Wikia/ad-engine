import { Container } from '@wikia/dependency-injection';
import { BingeBotPlatform } from './bingebot-platform';
import './styles.scss';

const container = new Container();
const platform = container.get(BingeBotPlatform);

platform.execute();
