---
title: 'The puzzles that get thrown away'
date: 2026-08-12
app: tenkt
lang: en
---

Every puzzle in Tenkt is generated locally on your phone, from the current date. The requirement is that a board must have exactly one solution, and that it can be found with logic alone, no guessing.

So the generator makes more boards than it publishes. A solver checks each one: if it has two solutions, it is discarded. If it requires guessing, it is discarded. The generator tries again until the board passes.

If you still find a board that makes you guess, that is a bug. Send me the date and the puzzle type and I will fix it.
