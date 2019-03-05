import * as Lint from 'tslint';
import * as ts from 'typescript';

// GitHub Issue: https://github.com/babel/babel/issues/8361
export class Rule extends Lint.Rules.AbstractRule {
	public static FAILURE_STRING = 'Files with only interfaces and types are forbidden.';

	public static STATEMENT_KINDS: ts.SyntaxKind[] = [
		ts.SyntaxKind.InterfaceDeclaration,
		ts.SyntaxKind.TypeAliasDeclaration,
	];

	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new NoSoleImportWalker(sourceFile, this.getOptions()));
	}
}

class NoSoleImportWalker extends Lint.RuleWalker {
	public visitSourceFile(sourceFile: ts.SourceFile) {
		const statementsWithModifiers = this.getStatementsWithModifiers(sourceFile);
		const interfacesAndTypes = this.getInterfacesAndTypes(statementsWithModifiers);
		const imports = this.getImports(statementsWithModifiers);

		if (
			statementsWithModifiers.length > 0 &&
			statementsWithModifiers.length - imports.length === interfacesAndTypes.length
		) {
			this.addFailureAtNode(sourceFile, Rule.FAILURE_STRING);
		}
	}

	private getInterfacesAndTypes(array: StatementWithModifiers[]) {
		return array.filter((statementWithModifiers: StatementWithModifiers) =>
			Rule.STATEMENT_KINDS.includes(statementWithModifiers.statement),
		);
	}

	private getImports(array: StatementWithModifiers[]) {
		return array.filter(
			(statementWithModifiers: StatementWithModifiers) =>
				statementWithModifiers.statement === ts.SyntaxKind.ImportDeclaration,
		);
	}

	private getStatementsWithModifiers(sourceFile: ts.SourceFile): StatementWithModifiers[] {
		return sourceFile.statements.map((statement: ts.Statement) => ({
			statement: statement.kind,
			modifiers:
				(statement.modifiers &&
					statement.modifiers.map((modifier: ts.Modifier) => modifier.kind)) ||
				[],
		}));
	}
}

interface StatementWithModifiers {
	statement: ts.SyntaxKind;
	modifiers: ModifierKind[];
}

type ModifierKind =
	| ts.SyntaxKind.AbstractKeyword
	| ts.SyntaxKind.AsyncKeyword
	| ts.SyntaxKind.ConstKeyword
	| ts.SyntaxKind.DeclareKeyword
	| ts.SyntaxKind.DefaultKeyword
	| ts.SyntaxKind.ExportKeyword
	| ts.SyntaxKind.PublicKeyword
	| ts.SyntaxKind.PrivateKeyword
	| ts.SyntaxKind.ProtectedKeyword
	| ts.SyntaxKind.ReadonlyKeyword
	| ts.SyntaxKind.StaticKeyword;
