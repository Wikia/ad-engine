import * as Lint from 'tslint';
import * as ts from 'typescript';

export class Rule extends Lint.Rules.AbstractRule {
	static FAILURE_STRING = 'Cannot import from blacklisted paths:';

	apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new NoBlacklistedPathsWalker(sourceFile, this.getOptions()));
	}
}

class NoBlacklistedPathsWalker extends Lint.RuleWalker {
	visitImportDeclaration(node: ts.ImportDeclaration): void {
		const [configuration] = this.getOptions();

		if (configuration) {
			const { blacklist } = configuration;
			const importText = node.getText();
			const failureString = `${Rule.FAILURE_STRING} ${blacklist.join(', ')}.`;

			if (this.isForbiddenImport(importText, blacklist)) {
				this.addFailureAtNode(node, failureString);
			}
		}
	}

	private isForbiddenImport(importText: string, blacklist: string[]): boolean {
		return blacklist.some((forbiddenImport: string) => {
			return importText.includes(`${forbiddenImport}`);
		});
	}
}
