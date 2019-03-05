"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
// This is example rule from https://palantir.github.io/tslint/develop/custom-rules/
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoImportsWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = 'import statement forbidden';
exports.Rule = Rule;
// The walker takes care of all the work.
class NoImportsWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
        // create a failure at the current position
        this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        // call the base version of this visitor to actually parse this node
        super.visitImportDeclaration(node);
    }
}
