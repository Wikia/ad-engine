import { MiddlewarePipeline } from './middleware-pipeline-adapter';
import { Middleware } from './middleware-types';

// TODO: Could be replaced with MiddlewarePipeline, but would increase scope.
// TODO: Best would be to replace it with FuncPipeline, but would require few adjustment on middleware side.
export class MiddlewareService<T> {
	private pipeline = new MiddlewarePipeline();

	add(middleware: Middleware<T>): this {
		this.pipeline.add(middleware);

		return this;
	}

	execute(context: any, final: Middleware<T>): void {
		this.pipeline.add(final);
		this.pipeline.execute(context);
	}
}
