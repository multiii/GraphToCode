import { Octokit } from "@octokit/rest";
import path from "path";
import { promises as fs } from "fs";
import { mkdir } from "fs/promises";

const octokit = new Octokit(); // no auth needed for public repos

async function downloadRepoFiles(repoUrl) {
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?\.git/);
  if (!match) {
    throw new Error("Invalid GitHub URL");
  }

  const owner = match[1];
  const repo = match[2];
  const branch = match[3] || "main";

  async function downloadDir(dirPath, localPath) {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: dirPath,
      ref: branch,
    });

    for (const item of data) {
      const itemPath = path.join(localPath, item.name);

      if (item.type === "file") {
        const file = await octokit.repos.getContent({
          owner,
          repo,
          path: item.path,
          ref: branch,
        });
        const content = Buffer.from(file.data.content, "base64").toString("utf-8");

        await mkdir(path.dirname(itemPath), { recursive: true });
        await fs.writeFile(itemPath, content, "utf-8");
        console.log(`Downloaded file: ${itemPath}`);
      } else if (item.type === "dir") {
        await downloadDir(item.path, itemPath);
      }
    }
  }

  const rootFolder = path.join(process.cwd(), "Downloaded files");
  await mkdir(rootFolder, { recursive: true });
  await downloadDir("", rootFolder);
}

// Example usage:
downloadRepoFiles("https://github.com/Srivats720/test.git")
  .then(() => console.log("All files downloaded."))
  .catch(console.error);
