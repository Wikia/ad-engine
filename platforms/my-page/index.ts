import { Container } from '@wikia/dependency-injection';
import { MyPagePlatform } from './my-page-platform';

const container = new Container();
const platform = container.get(MyPagePlatform);

platform.execute();
