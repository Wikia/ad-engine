"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const ts = require("typescript");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoSoleImportWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = 'Files with only interfaces and types are forbidden.';
Rule.STATEMENT_KINDS = [
    ts.SyntaxKind.InterfaceDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,
];
exports.Rule = Rule;
class NoSoleImportWalker extends Lint.RuleWalker {
    visitSourceFile(sourceFile) {
        const statementsWithModifiers = this.getStatementsWithModifiers(sourceFile);
        const interfacesAndTypes = this.getInterfacesAndTypes(statementsWithModifiers);
        const imports = this.getImports(statementsWithModifiers);
        if (statementsWithModifiers.length > 0 &&
            statementsWithModifiers.length - imports.length === interfacesAndTypes.length) {
            this.addFailureAtNode(sourceFile, Rule.FAILURE_STRING);
        }
    }
    getInterfacesAndTypes(array) {
        return array.filter((statementWithModifiers) => Rule.STATEMENT_KINDS.includes(statementWithModifiers.statement));
    }
    getImports(array) {
        return array.filter((statementWithModifiers) => statementWithModifiers.statement === ts.SyntaxKind.ImportDeclaration);
    }
    getStatementsWithModifiers(sourceFile) {
        return sourceFile.statements.map((statement) => ({
            statement: statement.kind,
            modifiers: (statement.modifiers &&
                statement.modifiers.map((modifier) => modifier.kind)) ||
                [],
        }));
    }
}
