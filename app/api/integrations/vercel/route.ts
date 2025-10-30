/**
 * app/api/integrations/vercel/route.ts
 * Vercel Deployment & Project Management Integration
 *
 * Actions:
 * - list_projects: List all Vercel projects
 * - get_deployments: Get deployments for a project
 * - create_deployment: Trigger new deployment
 * - get_domains: List domains for a project
 * - get_env_vars: Get environment variables
 * - set_env_var: Set environment variable
 * - get_logs: Get deployment logs
 */
import { NextRequest, NextResponse } from "next/server";

const VERCEL_API_KEY = process.env.VERCEL_API_KEY;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_API_URL = "https://api.vercel.com";

export async function POST(req: NextRequest) {
  try {
    // 🔐 CHECK USER AUTHENTICATION
    const cookies = req.headers.get('cookie') || '';
    const authCookieMatch = cookies.match(/saintsal_auth=([^;]+)/) || cookies.match(/saintsal_session=([^;]+)/);
    const authCookie = authCookieMatch ? authCookieMatch[1] : null;

    if (!authCookie) {
      console.log('❌ [VERCEL-INTEGRATION] No auth cookie - user not authenticated');
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    console.log(`🔐 [VERCEL-INTEGRATION] User authenticated: ${authCookie}`);

    if (!VERCEL_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "Vercel not configured",
        instructions: [
          "1. Go to https://vercel.com/account/tokens",
          "2. Create a new API token",
          "3. Add to .env.local: VERCEL_API_KEY=your_token",
          "4. Optional: Add VERCEL_TEAM_ID if using team account",
        ],
      }, { status: 503 });
    }

    const { action, ...params } = await req.json();

    const headers: HeadersInit = {
      "Authorization": `Bearer ${VERCEL_API_KEY}`,
      "Content-Type": "application/json",
    };

    const teamParam = VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : "";

    switch (action) {
      case "list_projects": {
        const { limit = 20 } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v9/projects${teamParam}&limit=${limit}`,
          { headers }
        );

        const data = await response.json();

        const projects = data.projects?.map((project: any) => ({
          id: project.id,
          name: project.name,
          framework: project.framework,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          link: project.link,
          latestDeployments: project.latestDeployments,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          projects,
        });
      }

      case "get_deployments": {
        const { projectId, limit = 10 } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v6/deployments${teamParam}&projectId=${projectId}&limit=${limit}`,
          { headers }
        );

        const data = await response.json();

        const deployments = data.deployments?.map((deployment: any) => ({
          uid: deployment.uid,
          name: deployment.name,
          url: deployment.url,
          state: deployment.state,
          readyState: deployment.readyState,
          createdAt: deployment.createdAt,
          creator: deployment.creator?.username,
          meta: deployment.meta,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          deployments,
        });
      }

      case "create_deployment": {
        const { projectId, gitBranch = "main", target = "production" } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v13/deployments${teamParam}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              projectId,
              gitBranch,
              target,
            }),
          }
        );

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          deployment: {
            uid: data.id,
            url: data.url,
            state: data.readyState,
            inspectorUrl: data.inspectorUrl,
          },
          message: response.ok ? "Deployment triggered successfully" : "Deployment failed",
        });
      }

      case "get_domains": {
        const { projectId } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v9/projects/${projectId}/domains${teamParam}`,
          { headers }
        );

        const data = await response.json();

        const domains = data.domains?.map((domain: any) => ({
          name: domain.name,
          verified: domain.verified,
          gitBranch: domain.gitBranch,
          redirect: domain.redirect,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          domains,
        });
      }

      case "get_env_vars": {
        const { projectId } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v9/projects/${projectId}/env${teamParam}`,
          { headers }
        );

        const data = await response.json();

        const envVars = data.envs?.map((env: any) => ({
          id: env.id,
          key: env.key,
          value: env.value?.substring(0, 4) + "****", // Masked for security
          target: env.target,
          type: env.type,
          createdAt: env.createdAt,
        })) || [];

        return NextResponse.json({
          success: response.ok,
          envVars,
        });
      }

      case "set_env_var": {
        const { projectId, key, value, target = ["production", "preview", "development"] } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v10/projects/${projectId}/env${teamParam}`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              key,
              value,
              target,
              type: "encrypted",
            }),
          }
        );

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          envVar: data,
          message: response.ok ? `Environment variable ${key} set successfully` : "Failed to set env var",
        });
      }

      case "get_logs": {
        const { deploymentId, limit = 100 } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v2/deployments/${deploymentId}/events${teamParam}&limit=${limit}`,
          { headers }
        );

        const logs = await response.text();

        return NextResponse.json({
          success: response.ok,
          logs,
        });
      }

      case "get_project": {
        const { projectId } = params;

        const response = await fetch(
          `${VERCEL_API_URL}/v9/projects/${projectId}${teamParam}`,
          { headers }
        );

        const data = await response.json();

        return NextResponse.json({
          success: response.ok,
          project: {
            id: data.id,
            name: data.name,
            framework: data.framework,
            buildCommand: data.buildCommand,
            outputDirectory: data.outputDirectory,
            installCommand: data.installCommand,
            devCommand: data.devCommand,
            createdAt: data.createdAt,
            link: data.link,
          },
        });
      }

      default:
        return NextResponse.json({
          error: "Invalid action. Available: list_projects, get_deployments, create_deployment, get_domains, get_env_vars, set_env_var, get_logs, get_project",
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Vercel API error:", error);
    return NextResponse.json({
      error: error.message || "Vercel integration failed",
    }, { status: 500 });
  }
}
