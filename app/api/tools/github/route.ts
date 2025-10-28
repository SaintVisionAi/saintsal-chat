/**
 * app/api/tools/github/route.ts
 * GitHub Repository Analysis and File Reading
 */
import { NextRequest, NextResponse } from "next/server";

interface GitHubFileContent {
  name: string;
  path: string;
  content?: string;
  type: string;
  size: number;
}

export async function POST(req: NextRequest) {
  try {
    const { action, owner, repo, path = "", branch = "main" } = await req.json();

    if (!owner || !repo) {
      return NextResponse.json(
        { error: "Owner and repo are required" },
        { status: 400 }
      );
    }

    const githubToken = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "User-Agent": "SaintSal-AI-Platform",
    };

    if (githubToken) {
      headers["Authorization"] = `Bearer ${githubToken}`;
    }

    switch (action) {
      case "get_repo_info": {
        // Get repository information
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          repo: {
            name: data.name,
            fullName: data.full_name,
            description: data.description,
            language: data.language,
            stars: data.stargazers_count,
            forks: data.forks_count,
            openIssues: data.open_issues_count,
            defaultBranch: data.default_branch,
            url: data.html_url,
            topics: data.topics || [],
            license: data.license?.name || "None",
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          },
        });
      }

      case "list_files": {
        // List files in repository
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        const files = Array.isArray(data) ? data : [data];

        return NextResponse.json({
          success: true,
          path,
          files: files.map((file: any) => ({
            name: file.name,
            path: file.path,
            type: file.type,
            size: file.size,
            url: file.html_url,
          })),
        });
      }

      case "read_file": {
        // Read file content
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.type !== "file") {
          return NextResponse.json(
            { error: "Path is not a file" },
            { status: 400 }
          );
        }

        // Decode base64 content
        const content = data.content
          ? Buffer.from(data.content, "base64").toString("utf-8")
          : "";

        return NextResponse.json({
          success: true,
          file: {
            name: data.name,
            path: data.path,
            size: data.size,
            content,
            url: data.html_url,
          },
        });
      }

      case "search_code": {
        // Search code in repository
        const { searchQuery } = await req.json();

        if (!searchQuery) {
          return NextResponse.json(
            { error: "searchQuery is required for search_code action" },
            { status: 400 }
          );
        }

        const response = await fetch(
          `https://api.github.com/search/code?q=${encodeURIComponent(searchQuery)}+repo:${owner}/${repo}`,
          { headers }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();

        return NextResponse.json({
          success: true,
          totalCount: data.total_count,
          results: data.items?.map((item: any) => ({
            name: item.name,
            path: item.path,
            url: item.html_url,
            repository: item.repository.full_name,
          })) || [],
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: get_repo_info, list_files, read_file, or search_code" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("GitHub API error:", error);

    // Check if it's a rate limit error
    if (error.message?.includes("403")) {
      return NextResponse.json(
        {
          error: "GitHub API rate limit exceeded. Please add GITHUB_TOKEN to .env.local",
          instructions: [
            "1. Go to https://github.com/settings/tokens",
            "2. Create a new token with 'repo' scope",
            "3. Add to .env.local: GITHUB_TOKEN=your_token_here",
          ],
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Failed to access GitHub repository",
      },
      { status: 500 }
    );
  }
}
