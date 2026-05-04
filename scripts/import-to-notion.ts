import { Client } from "@notionhq/client";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface SeedPost {
  date: string;
  day: string;
  time: string;
  week: number;
  phase: string;
  platform: string;
  format: string;
  pillar: string;
  audience: string;
  title: string;
  hook: string;
  cta: string;
  sourceNotes: string;
  productionNotes: string;
  status: string;
  performanceNotes: string;
}

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
      }
    }
  } catch {
    // .env.local optional
  }
}

function rt(value: string) {
  if (!value) return { rich_text: [] };
  return { rich_text: [{ type: "text" as const, text: { content: value } }] };
}

function selectProp(name: string) {
  return name ? { select: { name } } : { select: null };
}

async function main() {
  loadEnv();

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    console.error(
      "Missing NOTION_TOKEN or NOTION_DATABASE_ID. Set them in .env.local first.",
    );
    process.exit(1);
  }

  const seedPath = resolve(process.cwd(), "data", "seed.json");
  const posts = JSON.parse(readFileSync(seedPath, "utf8")) as SeedPost[];
  console.log(`Loaded ${posts.length} posts from seed.json`);

  const notion = new Client({ auth: token });

  let created = 0;
  for (const post of posts) {
    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Title: {
            title: [{ type: "text", text: { content: post.title } }],
          },
          Date: { date: { start: post.date } },
          Time: rt(post.time),
          Week: { number: post.week },
          Phase: selectProp(post.phase),
          Platform: selectProp(post.platform),
          Format: rt(post.format),
          Pillar: selectProp(post.pillar),
          Audience: rt(post.audience),
          Hook: rt(post.hook),
          CTA: rt(post.cta),
          "Source Notes": rt(post.sourceNotes),
          "Production Notes": rt(post.productionNotes),
          Status: selectProp(post.status),
          "Performance Notes": rt(post.performanceNotes),
        },
      });
      created++;
      process.stdout.write(`  [${created}/${posts.length}] ${post.date} — ${post.title.slice(0, 60)}\n`);
    } catch (err: any) {
      console.error(`  Failed for "${post.title}":`, err?.message ?? err);
    }
  }

  console.log(`\nDone. Created ${created} of ${posts.length} pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
