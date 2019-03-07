import * as Lint from 'tslint';
import * as ts from 'typescript';

// GitHub Issue: https://github.com/babel/babel/issues/8361
export class Rule extends Lint.Rules.AbstractRule {
	static FAILURE_STRING = 'Files with only interfaces and types are forbidden.';

	static TYPE_KINDS: ts.SyntaxKind[] = [
		ts.SyntaxKind.InterfaceDeclaration,
		ts.SyntaxKind.TypeAliasDeclaration,
	];

	static IMPORT_KINDS: ts.SyntaxKind[] = [ts.SyntaxKind.ImportDeclaration];

	static FIX_STRING = '\nexport {}; // tslint no-sole-types fix\n';

	apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new NoSoleTypesWalker(sourceFile, this.getOptions()));
	}
}

class NoSoleTypesWalker extends Lint.RuleWalker {
	visitSourceFile(sourceFile: ts.SourceFile): void {
		const onlyTypes: boolean = this.fileContainsOnlyTypes(sourceFile);

		if (onlyTypes) {
			this.addFailureAt(
				sourceFile.getEnd(),
				sourceFile.getWidth(),
				Rule.FAILURE_STRING,
				this.createFix(sourceFile),
			);
		}
	}

	private fileContainsOnlyTypes(sourceFile: ts.SourceFile): boolean {
		const kinds: ts.SyntaxKind[] = this.getStatementKinds(sourceFile);

		const statementsCount: number = kinds.length;
		const typesCount: number = this.getInterfacesAndTypes(kinds).length;
		const importsCount: number = this.getImports(kinds).length;

		return statementsCount > 0 && typesCount > 0 && kinds.length - importsCount === typesCount;
	}

	private getStatementKinds(sourceFile: ts.SourceFile): ts.SyntaxKind[] {
		return sourceFile.statements.map((statement: ts.Statement) => statement.kind);
	}

	private getInterfacesAndTypes(kinds: ts.SyntaxKind[]): ts.SyntaxKind[] {
		return kinds.filter((kind: ts.SyntaxKind) => Rule.TYPE_KINDS.includes(kind));
	}

	private getImports(kinds: ts.SyntaxKind[]): ts.SyntaxKind[] {
		return kinds.filter((kind: ts.SyntaxKind) => Rule.IMPORT_KINDS.includes(kind));
	}

	private createFix(sourceFile: ts.SourceFile): Lint.Fix {
		return new Lint.Replacement(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FIX_STRING);
	}
}
