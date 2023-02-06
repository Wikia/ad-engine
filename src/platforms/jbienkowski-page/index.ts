import { Container } from '@wikia/dependency-injection';
import { JbienkowskiPagePlatform } from './jbienkowski-page-platform';

const container = new Container();
const platform = container.get(JbienkowskiPagePlatform);

platform.execute();
