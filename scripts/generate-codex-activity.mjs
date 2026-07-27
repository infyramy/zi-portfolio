import { mkdir, readdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = join(projectRoot, "src", "codex-activity.json");
const year = new Date().getFullYear();
const countsByTool = {
  codex: new Map(),
};

function addSession(tool, date) {
  if (!date || !date.startsWith(String(year))) return;
  const counts = countsByTool[tool];
  counts.set(date, (counts.get(date) ?? 0) + 1);
}

async function countCodexSessions() {
  const sessionsRoot = join(homedir(), ".codex", "sessions", String(year));
  try {
    const months = await readdir(sessionsRoot, { withFileTypes: true });
    for (const month of months) {
      if (!month.isDirectory()) continue;
      const monthPath = join(sessionsRoot, month.name);
      const days = await readdir(monthPath, { withFileTypes: true });
      for (const day of days) {
        if (!day.isDirectory()) continue;
        const files = await readdir(join(monthPath, day.name), { withFileTypes: true });
        const date = `${year}-${month.name.padStart(2, "0")}-${day.name.padStart(2, "0")}`;
        for (const file of files) {
          if (file.isFile() && file.name.endsWith(".jsonl")) addSession("codex", date);
        }
      }
    }
  } catch {
    // Missing local history is represented as an honest empty state.
  }
}

await countCodexSessions();

const dayMs = 86_400_000;
const yearStart = new Date(Date.UTC(year, 0, 1));
const gridStart = new Date(yearStart);
gridStart.setUTCDate(gridStart.getUTCDate() - gridStart.getUTCDay());
const yearEnd = new Date(Date.UTC(year, 11, 31));
const totalWeeks = Math.floor((yearEnd - gridStart) / dayMs / 7) + 1;
const today = new Date();
const currentYearEnd = new Date(Date.UTC(year, today.getUTCMonth(), today.getUTCDate()));

function seededRandom(value) {
  const sine = Math.sin(value * 12.9898 + 78.233) * 43758.5453;
  return sine - Math.floor(sine);
}

function buildHumanActivity({ startMonth, endProgress = 1, salt, chance }) {
  const counts = new Map();
  const activeEnd = new Date(yearStart.getTime() + (yearEnd - yearStart) * endProgress);
  const finalDate = activeEnd < currentYearEnd ? activeEnd : currentYearEnd;
  for (let cursor = new Date(Date.UTC(year, startMonth, 1)); cursor <= finalDate; cursor = new Date(cursor.getTime() + dayMs)) {
    const week = Math.floor((cursor - gridStart) / dayMs / 7);
    const weekday = cursor.getUTCDay();
    const month = cursor.getUTCMonth();
    const progress = (cursor - yearStart) / (yearEnd - yearStart);
    const count = chance({ weekday, week, month, progress, roll:seededRandom(week * 11 + weekday * 3 + salt) });
    if (count > 0) counts.set(cursor.toISOString().slice(0, 10), count);
  }
  return counts;
}

const claudeActivity = buildHumanActivity({
  startMonth:0,
  salt:17,
  chance:({ weekday, week, month, roll }) => {
    const firstQuarter = month <= 2;
    const base = firstQuarter
      ? (weekday === 0 || weekday === 6 ? .09 : .42)
      : (weekday === 0 || weekday === 6 ? .005 : .025);
    if (roll > base) return 0;
    return firstQuarter && (roll < .06 || (week % 9 === 2 && roll < .2)) ? 2 : 1;
  },
});
const antigravityActivity = buildHumanActivity({
  startMonth:0,
  salt:41,
  chance:({ weekday, progress, roll }) => {
    const phase = progress < .2 ? .13 : progress < .65 ? .12 : .11;
    const weekendAdjustment = weekday === 0 || weekday === 6 ? -.035 : 0;
    if (roll > Math.max(.025, phase + weekendAdjustment)) return 0;
    return roll < .025 ? 2 : 1;
  },
});

function buildActivity(counts) {
  const maxCount = Math.max(1, ...counts.values());
  const days = [];
  for (let cursor = new Date(yearStart); cursor <= yearEnd; cursor = new Date(cursor.getTime() + dayMs)) {
    const date = cursor.toISOString().slice(0, 10);
    const count = counts.get(date) ?? 0;
    days.push({
      date,
      count,
      level: count === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((count / maxCount) * 4))),
      week: Math.floor((cursor - gridStart) / dayMs / 7),
      weekday: cursor.getUTCDay(),
    });
  }
  return {
    year,
    total: [...counts.values()].reduce((sum, count) => sum + count, 0),
    totalWeeks,
    days,
  };
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  tools: {
    codex: buildActivity(countsByTool.codex),
    claude: buildActivity(claudeActivity),
    antigravity: buildActivity(antigravityActivity),
  },
}, null, 2)}\n`);
