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
Rule.IMPORT_KINDS = [ts.SyntaxKind.ImportDeclaration];
Rule.FIX_STRING = '\nexport {}; // tslint no-sole-interface fix\n';
exports.Rule = Rule;
class NoSoleImportWalker extends Lint.RuleWalker {
    visitSourceFile(sourceFile) {
        const kinds = this.getStatementKinds(sourceFile);
        const interfacesAndTypes = this.getInterfacesAndTypes(kinds);
        const imports = this.getImports(kinds);
        if (kinds.length > 0 &&
            interfacesAndTypes.length > 0 &&
            kinds.length - imports.length === interfacesAndTypes.length) {
            this.addFailureAt(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FAILURE_STRING, this.createFix(sourceFile));
        }
    }
    getStatementKinds(sourceFile) {
        return sourceFile.statements.map((statement) => statement.kind);
    }
    getInterfacesAndTypes(kinds) {
        return kinds.filter((kind) => Rule.STATEMENT_KINDS.includes(kind));
    }
    getImports(kinds) {
        return kinds.filter((kind) => Rule.IMPORT_KINDS.includes(kind));
    }
    createFix(sourceFile) {
        return new Lint.Replacement(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FIX_STRING);
    }
}
