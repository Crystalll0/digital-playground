# Proposal: Hash Brown Catch

## One-line pitch
Slide a fry basket to catch falling pixel hash browns before they hit the counter and turn into sad mashed potato.

## Who it is for
People who want a 1-minute break between classes or work: casual players on a laptop or phone. Playing should need no instructions beyond "move the basket".

## What they do and how it responds
| Player does | Game responds |
|---|---|
| Moves mouse / drags finger / presses ← → | Basket slides under the pointer |
| Catches a hash brown | +points, crunch sound, golden flash, Crispy cheers in the basket |
| Misses one | −points, squelch sound, it becomes a mash with a little ghost |
| Keeps playing | Things fall faster; the round ends after 60 s with a score screen |

## Multimedia
Pixel sprites with frame animation, a diner background illustration, sound effects for catch / miss / start.

## Scope
- **Must have (MVP):** basket control, falling hash browns, catch / miss, score, timer, sounds.
- **Should have:** start / pause / results screens, difficulty levels, hazards to dodge, power-ups, phone support.
- **Could have:** persistent rewards to make people replay, a character page, a demo video.

## Technology
p5.js + p5.sound in the browser, hosted as a static site (GitHub Pages).

## Questions for the instructor
1. Is this scope right for a 3-person team over 5 weeks?
2. Is GitHub Pages under the sd5913 organisation OK for the live version?
