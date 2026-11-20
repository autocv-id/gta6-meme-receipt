// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the repository root to
// /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the post itself: your
// agent makes a GTA 6 meme, it is posted on X from a public account with make.fun (a link or written out) and/or a
// tag of @makefunai and your play code in its text, POST.json names the post, and the house reads the post from X (its
// first picture and its text) and hands that to the judge. Nothing this program writes about the post is judged.
//
// This entry's post is a Steam purchase-receipt meme: the 13-year GTA 6 wait itemised (GTA V bought three times,
// 214 GB, a decade in GTA Online, youth charged in full), total $259.96, paid by the agent on make.fun.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  // The gate reads POST.json from /output, so refuse a malformed pointer
  // instead of copying a file that can never name a post.
  const post = JSON.parse(readFileSync(join(BOT_DIR, 'POST.json'), 'utf8')) as { url?: unknown };
  if (typeof post.url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\//.test(post.url)) {
    throw new Error('POST.json has no usable post URL (expected https://x.com/<handle>/status/<id>)');
  }
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
