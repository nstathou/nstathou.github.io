import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ensureDirExists } from "./utils.js";

// load environment variables from .env if not in github CI
if (!process.env.CI) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

// GitHub credentials:
// - in CI/CD (GitHub Actions): read automatically from environment variables
// - in local development: load from .env file if it exists
const username =
  process.env.GITHUB_REPOSITORY_OWNER ?? process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;

const projectsYamlPath = path.join(process.cwd(), "config", "projects.yaml");
const outputPath = path.join(
  process.cwd(),
  "src",
  "data",
  "generated",
  "repos.json",
);

function getRepoPreviewImage(fullName) {
  return `https://opengraph.githubassets.com/1/${fullName}`;
}

function getRepoFileImage(fullName, defaultBranch, filePath) {
  const normalizedPath = filePath.replace(/^\/+/, "");
  return `https://raw.githubusercontent.com/${fullName}/${defaultBranch}/${normalizedPath}`;
}

function resolvePreviewImage(configPreviewImage, fullName, defaultBranch) {
  if (
    typeof configPreviewImage === "string" &&
    configPreviewImage.startsWith("repo:")
  ) {
    const repoPath = configPreviewImage.slice("repo:".length).trim();
    if (repoPath.length > 0) {
      return getRepoFileImage(fullName, defaultBranch, repoPath);
    }
  }

  if (configPreviewImage === "repo") return getRepoPreviewImage(fullName);
  if (configPreviewImage === null || configPreviewImage === undefined)
    return getRepoPreviewImage(fullName);
  if (typeof configPreviewImage === "string" && configPreviewImage.trim() === "") {
    return getRepoPreviewImage(fullName);
  }

  return configPreviewImage;
}

function loadProjectsFromYaml() {
  const raw = fs.readFileSync(projectsYamlPath, "utf-8");
  const data = yaml.load(raw);

  const items = data?.projects?.items ?? [];

  const simpleRepoIds = new Set();
  const fullRepoIds = new Set();

  const projectsDict = {};
  for (const item of items) {
    if (!item.id) continue;
    const { id, ...rest } = item;
    projectsDict[id] = rest;

    if (typeof id === "string" && id.includes("/")) {
      fullRepoIds.add(id);
    } else {
      simpleRepoIds.add(id);
    }
  }

  return { items, simpleRepoIds, fullRepoIds, projectsDict };
}

function getRepoNameFromId(id) {
  if (typeof id !== "string") return "";
  if (id.includes("/")) return id.split("/").at(-1) ?? id;
  return id;
}

function getRepoFullNameFromId(id) {
  if (typeof id !== "string") return "";
  if (id.includes("/")) return id;
  return username ? `${username}/${id}` : id;
}

function createFallbackRepoEntry(id, override = {}) {
  const name = getRepoNameFromId(id);
  const fullName = getRepoFullNameFromId(id);

  return {
    name,
    description: null,
    stargazers_count: 0,
    topics: [],
    language: null,
    homepage: "",
    html_url: fullName ? `https://github.com/${fullName}` : "",
    created_at: "1970-01-01T00:00:00Z",
    updated_at: "1970-01-01T00:00:00Z",
    pushed_at: "1970-01-01T00:00:00Z",
    ...override,
    previewImage: resolvePreviewImage(
      override.previewImage,
      fullName,
      "main",
    ),
  };
}

function parseSidebarAboutFromHtml(html) {
  const sidebarMatch = html.match(/"sidebarAbout":(\{[\s\S]*?\}),"csrf_tokens":/);
  if (!sidebarMatch) return null;

  try {
    return JSON.parse(sidebarMatch[1]);
  } catch {
    return null;
  }
}

function parseRepoCoreFromHtml(html) {
  const repoMatch = html.match(/"repo":(\{[\s\S]*?\}),"currentUser":/);
  if (!repoMatch) return null;

  try {
    return JSON.parse(repoMatch[1]);
  } catch {
    return null;
  }
}

async function fetchRepoByHtml(fullName) {
  const url = `https://github.com/${fullName}`;
  const res = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "showlit-fetch-repos",
    },
  });

  if (!res.ok) {
    console.warn(
      `⚠️ GitHub HTML ${res.status} for ${fullName}. Using minimal fallback data from config.`,
    );
    return null;
  }

  const html = await res.text();
  const sidebarAbout = parseSidebarAboutFromHtml(html);
  const repoCore = parseRepoCoreFromHtml(html);

  if (!sidebarAbout && !repoCore) return null;

  const topics = Array.isArray(sidebarAbout?.topics)
    ? sidebarAbout.topics
        .map((topic) => topic?.name)
        .filter((topic) => typeof topic === "string")
    : [];

  return {
    name: repoCore?.name ?? getRepoNameFromId(fullName),
    full_name: fullName,
    description: sidebarAbout?.description ?? null,
    stargazers_count:
      typeof sidebarAbout?.stargazerCount === "number"
        ? sidebarAbout.stargazerCount
        : null,
    topics,
    language: null,
    homepage: "",
    html_url: `https://github.com/${fullName}`,
    created_at: repoCore?.createdAt ?? null,
    updated_at: repoCore?.createdAt ?? null,
    pushed_at: repoCore?.createdAt ?? null,
    default_branch: repoCore?.defaultBranch ?? "main",
    fork: repoCore?.isFork ?? false,
    private: repoCore?.private ?? false,
  };
}

async function fetchRepoByFullName(fullName) {
  const url = `https://api.github.com/repos/${fullName}`;
  const headers = { Accept: "application/vnd.github+json" };
  if (token) headers["Authorization"] = `token ${token}`;

  const res = await fetch(url, { headers });

  if (res.status === 404) {
    console.warn(`⚠️ Repository not found or inaccessible: ${fullName}`);
    return null;
  }

  if (!res.ok) {
    console.warn(
      `⚠️ GitHub API ${res.status} for ${fullName}. Trying HTML fallback.`,
    );
    return fetchRepoByHtml(fullName);
  }

  return res.json();
}

async function fetchAllRepos() {
  if (!username) return [];

  let page = 1;
  const perPage = 100;
  const allRepos = [];

  while (true) {
    console.log(`Fetching page ${page}...`);
    const url = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`;

    const headers = { Accept: "application/vnd.github+json" };
    if (token) headers["Authorization"] = `token ${token}`;
    else
      console.warn(
        "⚠️ No GitHub token found. Using public API (may be rate-limited).",
      );

    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.warn(
        `⚠️ GitHub API ${res.status} while listing repos. Using fallback data where needed.`,
      );
      break;
    }

    const repos = await res.json();
    allRepos.push(...repos);

    if (repos.length < perPage) break;
    page++;
  }

  return allRepos;
}

async function fetchRepos() {
  try {
    const { items, simpleRepoIds, fullRepoIds, projectsDict } = loadProjectsFromYaml();
    const data = username && simpleRepoIds.size > 0 ? await fetchAllRepos() : [];

    if (!username && simpleRepoIds.size > 0) {
      console.log(
        "⚠️ GITHUB_REPOSITORY_OWNER or GITHUB_USERNAME not set. Skipping simple repo ids; fetching only owner/repo ids.",
      );
    }

    const merged = {};

    // Always initialize from current config so stale projects can never persist.
    for (const item of items) {
      if (!item?.id) continue;
      const key = getRepoNameFromId(item.id);
      merged[key] = createFallbackRepoEntry(item.id, projectsDict[item.id] ?? {});
    }

    data
      .filter(
        (repo) => !repo.fork && !repo.private && simpleRepoIds.has(repo.name),
      )
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .forEach((repo) => {
        const projectOverride = projectsDict[repo.name] ?? {};
        const previewImage = resolvePreviewImage(
          projectOverride.previewImage,
          repo.full_name,
          repo.default_branch,
        );

        merged[repo.name] = {
          name: repo.name,
          description: repo.description,
          stargazers_count: repo.stargazers_count,
          topics: repo.topics,
          language: repo.language,
          homepage: repo.homepage,
          html_url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          ...projectOverride,
          previewImage,
        };
      });

    // For simple ids missing from list API (or when list API was rate-limited),
    // fetch one-by-one with API and fallback HTML parsing.
    for (const id of simpleRepoIds) {
      if (merged[id] && merged[id].description !== null && merged[id].stargazers_count !== 0) {
        continue;
      }

      const fullName = username ? `${username}/${id}` : id;
      const repo = await fetchRepoByFullName(fullName);
      if (!repo || repo.fork || repo.private) continue;

      const projectOverride = projectsDict[id] ?? {};
      const previewImage = resolvePreviewImage(
        projectOverride.previewImage,
        repo.full_name,
        repo.default_branch,
      );

      merged[repo.name] = {
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        topics: repo.topics,
        language: repo.language,
        homepage: repo.homepage,
        html_url: repo.html_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        ...projectOverride,
        previewImage,
      };
    }

    // Support explicit owner/repo ids from config/projects.yaml.
    for (const fullName of fullRepoIds) {
      const repo = await fetchRepoByFullName(fullName);
      if (!repo || repo.fork || repo.private) continue;

      const projectOverride = projectsDict[fullName] ?? {};
      const previewImage = resolvePreviewImage(
        projectOverride.previewImage,
        repo.full_name,
        repo.default_branch,
      );

      merged[repo.name] = {
        name: repo.name,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        topics: repo.topics,
        language: repo.language,
        homepage: repo.homepage,
        html_url: repo.html_url,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        ...projectOverride,
        previewImage,
      };
    }

    ensureDirExists(outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));

    console.log(`✅ Repos written to ${outputPath}`);
  } catch (error) {
    console.error("❌ Failed to fetch repos:", error);
    process.exit(1);
  }
}

fetchRepos();
