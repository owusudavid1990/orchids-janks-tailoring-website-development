// Tailwind v4 wants the prefix FIRST: `jt:hover:text-gold`, not `hover:jt:text-gold`. Normalise any file passed in.
import fs from "node:fs";
for (const f of process.argv.slice(2)) {
  const s = fs.readFileSync(f, "utf8");
  const out = s.replace(/(?<![\w:\[-])((?:[a-z0-9\-\[\]=*.&>_]+:)+)jt:/g, (m, v) => "jt:" + v);
  if (out !== s) { fs.writeFileSync(f, out); console.log("fixed", f); }
}
