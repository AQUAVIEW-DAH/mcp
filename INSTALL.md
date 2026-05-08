# Installing AQUAVIEW MCP

The AQUAVIEW MCP server is hosted at:

```
https://mcp.aquaview.org/mcp
```

It speaks **HTTP transport** (the modern MCP standard, formerly called Streamable HTTP). No installation, no API keys, no rate-limit signup. Just point your MCP client at the URL.

This page covers every supported client. Pick yours.

---

## Table of contents

- [Claude Code (CLI)](#claude-code-cli)
- [Claude Desktop (macOS / Windows)](#claude-desktop)
- [Anthropic API direct (Python / TypeScript)](#anthropic-api-direct)
- [ChatGPT Custom Connector](#chatgpt-custom-connector)
- [OpenAI Agents SDK (Python / TypeScript)](#openai-agents-sdk)
- [Google Gemini Agent SDK](#google-gemini-agent-sdk)
- [Cursor](#cursor)
- [Cline](#cline)
- [Continue](#continue)
- [Zed](#zed)
- [Verifying it works](#verifying-it-works)
- [Troubleshooting](#troubleshooting)

---

## Claude Code (CLI)

One command:

```bash
claude mcp add --transport http aquaview https://mcp.aquaview.org/mcp
```

Restart your session and ask Claude: *"List the AQUAVIEW collections."*

## Claude Desktop

1. Open **Claude → Settings → Developer → Edit Config**.
2. Merge the snippet below into the `mcpServers` block:

```json
{
  "mcpServers": {
    "aquaview": {
      "type": "http",
      "url": "https://mcp.aquaview.org/mcp"
    }
  }
}
```

3. Quit and relaunch Claude Desktop. You should see AQUAVIEW's four tools in the tool picker (the small hammer icon under the input box).

> Older Claude Desktop builds without HTTP transport support can use the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) shim. See [Troubleshooting](#troubleshooting).

## Anthropic API direct

The Anthropic API supports remote MCP servers as a first-class parameter — your application doesn't need to host or proxy anything.

```python
from anthropic import Anthropic

client = Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    mcp_servers=[{
        "type": "url",
        "url": "https://mcp.aquaview.org/mcp",
        "name": "aquaview",
    }],
    messages=[{
        "role": "user",
        "content": "Find Argo float profiles within 200 km of Hawaii in March 2026.",
    }],
)

print(response.content)
```

TypeScript (`@anthropic-ai/sdk`) takes the same `mcp_servers` array.

## ChatGPT Custom Connector

ChatGPT Plus/Pro/Team workspaces with **Custom Connectors** enabled can add AQUAVIEW directly:

1. Open **ChatGPT → Settings → Connectors → Add custom**.
2. Name: `AQUAVIEW`. Server URL: `https://mcp.aquaview.org/mcp`. Transport: `Streamable HTTP`.
3. Save. The connector appears in the model picker; toggle it on for any chat.

## OpenAI Agents SDK

The [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) supports MCP through the hosted-MCP tool type. No proxy, no shim:

```python
from agents import Agent, Runner
from agents.mcp.server import MCPServerStreamableHttp

aquaview = MCPServerStreamableHttp(
    name="aquaview",
    params={"url": "https://mcp.aquaview.org/mcp"},
)

agent = Agent(
    name="Ocean Researcher",
    model="gpt-5",
    instructions="You answer ocean and atmospheric science questions using AQUAVIEW.",
    mcp_servers=[aquaview],
)

result = Runner.run_sync(agent, "Show me Hurricane Ian buoy data.")
print(result.final_output)
```

The TypeScript SDK exposes the same `MCPServerStreamableHttp` class.

## Google Gemini Agent SDK

The Gemini API exposes MCP servers as native tools through the [`google-genai`](https://github.com/googleapis/python-genai) Python SDK:

```python
from google import genai
from google.genai import types

client = genai.Client()

aquaview = types.Tool(
    mcp=types.McpToolConfig(
        server_url="https://mcp.aquaview.org/mcp",
        transport="http",
    )
)

response = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="What's the current sea surface temperature near the Florida Keys?",
    config=types.GenerateContentConfig(tools=[aquaview]),
)

print(response.text)
```

## Cursor

1. **Settings → MCP → Add new MCP Server**.
2. Name: `aquaview`. Type: `http`. URL: `https://mcp.aquaview.org/mcp`.
3. Cursor reconnects automatically. The status dot turns green when the four tools are loaded.

## Cline

In your VS Code workspace, edit `.cline/mcp_settings.json`:

```json
{
  "mcpServers": {
    "aquaview": {
      "type": "streamable-http",
      "url": "https://mcp.aquaview.org/mcp"
    }
  }
}
```

## Continue

Edit `~/.continue/config.json`:

```json
{
  "mcpServers": [
    {
      "name": "aquaview",
      "transport": {
        "type": "http",
        "url": "https://mcp.aquaview.org/mcp"
      }
    }
  ]
}
```

## Zed

Zed reads MCP servers from `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "aquaview": {
      "command": {
        "transport": "http",
        "url": "https://mcp.aquaview.org/mcp"
      }
    }
  }
}
```

---

## Verifying it works

After connecting in any client, run this prompt:

> List the AQUAVIEW collections and tell me how many there are.

You should see the model call `list_collections` and report **68 collections**. If it reports a different number or fails to call the tool, see Troubleshooting.

## Troubleshooting

**"No tools found" / connector shows as offline.** Confirm the URL is exactly `https://mcp.aquaview.org/mcp` — note the trailing `/mcp` path component is required.

**Client only supports stdio (older Claude Desktop, some IDE plugins).** Use the [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) bridge:

```json
{
  "mcpServers": {
    "aquaview": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.aquaview.org/mcp"]
    }
  }
}
```

**Corporate proxy / firewall.** The endpoint requires outbound HTTPS to `mcp.aquaview.org` on port 443. The connection is a long-lived streaming HTTP request; some intercepting proxies break it. If you see frequent disconnects, add `mcp.aquaview.org` to your bypass list.

**Still stuck?** Open an issue with your client name, version, and any error logs.
