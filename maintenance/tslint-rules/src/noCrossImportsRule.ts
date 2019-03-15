import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
	static FAILURE_STRING = 'Cannot import from blacklisted children/sibling package.';

	apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new NoCrossImportsWalker(sourceFile, this.getOptions()));
	}
}

class NoCrossImportsWalker extends Lint.RuleWalker {
	visitImportDeclaration(node: ts.ImportDeclaration): void {
		const [configuration] = this.getOptions();
		const sourceFile = this.getSourceFile();

		if (configuration) {
			const { blacklist } = configuration;
			const importText = node.getText();

			if (this.isForbiddenImport(importText, blacklist)) {
				this.addFailureAt(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FAILURE_STRING);
			}
		}
	}

	private isForbiddenImport(importText: string, blacklist: string[]): boolean {
		return (
			blacklist.filter((forbiddenImport: string) => {
				return importText.indexOf(`/${forbiddenImport}`) !== -1;
			}).length > 0
		);
	}
}
