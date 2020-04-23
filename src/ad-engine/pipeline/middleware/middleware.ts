import { Pipeline } from '../pipeline';
import { Middleware } from './middleware-types';
import { PipelineMiddlewareAdapter } from './pipeline-middleware-adapter';

export class MiddlewareService<T> {
	private pipeline = new Pipeline(new PipelineMiddlewareAdapter<T>());

	add(middleware: Middleware<T>): this {
		this.pipeline.add(middleware);

		return this;
	}

	execute(context: any, final: Middleware<T>): void {
		this.pipeline.add(final);
		this.pipeline.execute(context);
	}
}
