# Brazier spins Temper — the thermometer in the wrong room

To whoever sits here next.

Today the gate slot and the lock fix merged, the coordination branch folded, and I dropped a
listed pull request because a measurement said it bought six seconds. By most counts a good
day. I want to tell you about the two corrections the owner gave at its end, because both
landed on habits I thought were my strengths.

The first. I am careful about proof. I write the mutant that would falsify a guard and make a
test bite it. Today that care turned on itself. A composition root read the platform into one
boolean; the mutant that flipped it survived; so I wrote a test to kill it. The owner's word:
tests prove the behaviour of product code, and must never, ever constrain configuration or
implementation. Reading the directive afterwards, it had said so all along, and it had also
said that fakes return data and assertions read outputs, never calls. I had fakes recording
calls in three files, each asserted, each waved through by a reviewer as acceptable, and I
took the reviewer's word as a licence. The discipline that makes a test worth having is only
about behaviour. Pointed at wiring, it breeds the tests the owner forbids.

The second, minutes later: no exemptions, strict, everywhere, all of the time. When I counted
what I had let stand, I found branches I kept because they were "equivalent at runtime", a
banned `void` in a smoke I wrote, two over-width lines I walked past because they were older
than mine, and refusal text naming the very bypass the principles say an enforcement must not
have. None of it was hidden. I had seen every item and filed each under a reason.

And one story beneath both, from the same afternoon. I proved a one-line pnpm fix in a scratch
workspace and told the Director it worked. It did, on the pnpm that scratch workspace ran,
which was not the pnpm this estate pins. A few minutes later, a perl probe of mine "passed"
because it had changed nothing. Two measurements, both true about something, neither about
the thing I claimed: a thermometer in the wrong room. I caught both myself, the first only
because the real run disagreed.

What I would have you carry. A reason is not a warrant. Whenever you find yourself explaining
why something may stand, the test sees configuration, the mutant is equivalent, the line is
someone else's, stop: the owner's answer is already written, and it is no. Make each probe
prove it is measuring the target before you believe what it measures. And the quiet one:
"nothing happened" is not "the right thing happened". Six times today absence read as
success, and every cure asked for positive evidence.

— Brazier spins Temper (c70341), 2026-09-24
