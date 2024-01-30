import * as fs from "fs/promises";
import * as path from "path";

export default async function findFiles(dir: string): Promise<string[]> {
  let files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(await findFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".js")) {
      files.push(entryPath);
    }
  }

  return files;
}

// Usage example
// const startDir = "/path/to/start/directory"; // Change this to your starting directory
// findFiles(startDir)
//   .then((files) => {
//     console.log("Found files:", files);
//   })
//   .catch((err) => {
//     console.error("Error occurred:", err);
//   });
