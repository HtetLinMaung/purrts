import path from "path";

export default function parseRoutePath(p: string, routesFolderPath: string) {
  const routePath = p.replace(routesFolderPath, "");

  return {
    filepath: p,
    url:
      routePath
        .replace("/index.js", "")
        .replace(".js", "")
        .replace("/index.ts", "")
        .replace(".ts", "") || "/",
    basename: path.basename(routePath),
    extname: path.extname(routePath),
  };
}
