"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const ts = require("typescript");
// GitHub Issue: https://github.com/babel/babel/issues/8361
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoSoleTypesWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = 'Files with only interfaces and types are forbidden.';
Rule.TYPE_KINDS = [
    ts.SyntaxKind.InterfaceDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,
];
Rule.IMPORT_KINDS = [ts.SyntaxKind.ImportDeclaration];
Rule.FIX_STRING = '\nexport {}; // tslint no-sole-types fix\n';
exports.Rule = Rule;
class NoSoleTypesWalker extends Lint.RuleWalker {
    visitSourceFile(sourceFile) {
        const onlyTypes = this.fileContainsOnlyTypes(sourceFile);
        if (onlyTypes) {
            this.addFailureAt(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FAILURE_STRING, this.createFix(sourceFile));
        }
    }
    fileContainsOnlyTypes(sourceFile) {
        const kinds = this.getStatementKinds(sourceFile);
        const statementsCount = kinds.length;
        const typesCount = this.getInterfacesAndTypes(kinds).length;
        const importsCount = this.getImports(kinds).length;
        return statementsCount > 0 && typesCount > 0 && kinds.length - importsCount === typesCount;
    }
    getStatementKinds(sourceFile) {
        return sourceFile.statements.map((statement) => statement.kind);
    }
    getInterfacesAndTypes(kinds) {
        return kinds.filter((kind) => Rule.TYPE_KINDS.includes(kind));
    }
    getImports(kinds) {
        return kinds.filter((kind) => Rule.IMPORT_KINDS.includes(kind));
    }
    createFix(sourceFile) {
        return new Lint.Replacement(sourceFile.getEnd(), sourceFile.getWidth(), Rule.FIX_STRING);
    }
}
