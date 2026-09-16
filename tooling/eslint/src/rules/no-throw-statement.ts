import { createMessage, type RuleWithReappraisingMessages } from '../reappraising-message.js';

/**
 * ESLint rule that bans `throw` statements in favour of the Result pattern.
 *
 * @remarks
 * Repository doctrine (`.agent/rules/use-result-pattern.md`) is that errors are part
 * of the type signature: a function that can fail returns `Result<T, E>`, and
 * the compiler forces every caller to handle both arms. A `throw` re-introduces
 * the invisible control-flow edge the Result pattern exists to remove. Genuine
 * boundary translations — re-expressing an error from a library that cannot
 * return a `Result` — belong at a single named edge, translated to a `Result`
 * there, not scattered through the call graph.
 *
 * Wired at `warn` first (see `configs/recommended.ts`) per the
 * `no-warning-toleration` rule-authoring nuance: the existing-throw surface
 * (notably workspaces that predate Result adoption, such as `agent-tools`) is
 * captured at `warn` while the throw→Result retrofit lane migrates it and the
 * false-positive profile (test files, sanctioned boundary throws) is designed.
 * Promotion to `error` lands with that lane.
 */
const noThrowStatementRule: RuleWithReappraisingMessages<'throwBanned'> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban throw statements so errors flow through the Result pattern (.agent/rules/use-result-pattern.md) and stay in the type signature.',
    },
    schema: [],
    messages: {
      throwBanned: createMessage({
        prohibition: 'Throwing is banned: a thrown error is invisible to the type system.',
        reappraisal:
          'Return a Result<T, E> (err(...)) from a Result-typed function; where a library that cannot return Result must be wrapped, translate the error to a Result at that single boundary. See .agent/rules/use-result-pattern.md.',
      }),
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      ThrowStatement(node) {
        context.report({
          node,
          messageId: 'throwBanned',
        });
      },
    };
  },
};

export { noThrowStatementRule };
