import 'reflect-metadata';
import { container } from 'tsyringe';
import { BingeBotPlatform } from './bingebot-platform';
import './styles.scss';

const platform = container.resolve(BingeBotPlatform);

platform.execute();
