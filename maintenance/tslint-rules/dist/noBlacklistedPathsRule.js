"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new NoBlacklistedPathsWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = 'Cannot import from blacklisted paths:';
exports.Rule = Rule;
class NoBlacklistedPathsWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
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
    isForbiddenImport(importText, blacklist) {
        return blacklist.some((forbiddenImport) => {
            return importText.includes(`/${forbiddenImport}`);
        });
    }
}
