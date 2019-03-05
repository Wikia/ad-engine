import * as Lint from 'tslint';
import * as ts from 'typescript';

// GitHub Issue: https://github.com/babel/babel/issues/8361
export class Rule extends Lint.Rules.AbstractRule {
	static FAILURE_STRING = 'Files with only interfaces and types are forbidden.';

	static STATEMENT_KINDS: ts.SyntaxKind[] = [
		ts.SyntaxKind.InterfaceDeclaration,
		ts.SyntaxKind.TypeAliasDeclaration,
	];

	static IMPORT_KINDS: ts.SyntaxKind[] = [ts.SyntaxKind.ImportDeclaration];

	static FIX_STRING = '\nexport {}; // tslint no-sole-interface fix\n';

	apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new NoSoleImportWalker(sourceFile, this.getOptions()));
	}
}

class NoSoleImportWalker extends Lint.RuleWalker {
	visitSourceFile(sourceFile: ts.SourceFile): void {
		const kinds = this.getStatementKinds(sourceFile);
		const interfacesAndTypes = this.getInterfacesAndTypes(kinds);
		const imports = this.getImports(kinds);

		if (
			kinds.length > 0 &&
			interfacesAndTypes.length > 0 &&
			kinds.length - imports.length === interfacesAndTypes.length
		) {
			this.addFailureAt(
				sourceFile.getEnd(),
				sourceFile.getWidth(),
				Rule.FAILURE_STRING,
				this.createFix(sourceFile),
			);
		}
	}

	private getStatementKinds(sourceFile: ts.SourceFile): ts.SyntaxKind[] {
		return sourceFile.statements.map((statement: ts.Statement) => statement.kind);
	}

	private getInterfacesAndTypes(kinds: ts.SyntaxKind[]): ts.SyntaxKind[] {
		return kinds.filter((kind: ts.SyntaxKind) => Rule.STATEMENT_KINDS.includes(kind));
	}

	private getImports(kinds: ts.SyntaxKind[]): ts.SyntaxKind[] {
		return kinds.filter((kind: ts.SyntaxKind) => Rule.IMPORT_KINDS.includes(kind));
	}

	private createFix(sourceFile: ts.SourceFile): Lint.Fix {
		return new Lint.Replacement(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FIX_STRING);
	}
}
