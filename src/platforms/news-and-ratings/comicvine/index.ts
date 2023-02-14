import 'reflect-metadata';
import { container } from 'tsyringe';
import { ComicvinePlatform } from './comicvine-platform';
import './styles.scss';

const platform = container.resolve(ComicvinePlatform);

platform.execute();
