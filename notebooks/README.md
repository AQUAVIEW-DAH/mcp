# Notebooks

Three Jupyter notebooks showing the same research question — *"Find Argo float profiles around Hawaii in March 2026 where the float reached at least 1500 dbar pressure. Summarize temperature ranges and give me a few download links."* — answered by three different LLM providers using their native MCP support.

| File | Provider | SDK | API surface |
|---|---|---|---|
| [`01-claude-mcp-agent.ipynb`](01-claude-mcp-agent.ipynb) | Anthropic | `anthropic` (Python) | Messages API, `mcp_servers=[...]` |
| [`02-chatgpt-mcp-agent.ipynb`](02-chatgpt-mcp-agent.ipynb) | OpenAI | `openai` (Python) | Responses API, `tools=[{"type":"mcp",...}]` |
| [`03-gemini-mcp-agent.ipynb`](03-gemini-mcp-agent.ipynb) | Google | `google-genai` + `mcp` (Python) | `generate_content` with `tools=[session]` |

All three notebooks use the **Pattern A** approach — the LLM autonomously calls Aquaview MCP tools to answer the question. None of them call Aquaview directly from Python; the agent is in the loop.

## Why all three?

So you can compare. Same MCP server, same prompt, three different agent runtimes — see how each one reasons over the catalog, decomposes the question, and structures its tool calls.

The notebooks intentionally have the same structure: install → setup → first call → inspect tool trace → render answer → multi-turn → streaming → next steps.

## Setup (any notebook)

```bash
pip install jupyter
jupyter notebook
```

Each notebook has a setup cell at the top that installs the provider's SDK and reads its API key from the environment.

| Provider | API key env var | Get a key |
|---|---|---|
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com |
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com |
| Google | `GOOGLE_API_KEY` | https://aistudio.google.com/apikey |

## Note on cost

Each notebook makes one to three model calls. Token usage is small — the MCP tool calls happen server-side via the Aquaview HTTP endpoint and are billed only for the parts the model actually reads. Expect under $0.05 per full run on each provider.

## Differences worth knowing

- **Claude (Anthropic)** — `mcp_servers` is a top-level parameter on `messages.create`. Tool calls and results appear interleaved in `response.content` as `mcp_tool_use` / `mcp_tool_result` blocks.
- **ChatGPT (OpenAI)** — `mcp` is a tool type in `tools=[...]`. Tool calls and results appear in `response.output` as `mcp_call` items. Use `previous_response_id` for multi-turn.
- **Gemini (Google)** — passes the `mcp.ClientSession` directly into `tools=[session]`. The SDK auto-discovers tools from the live server and runs the function-calling loop internally.

All three speak the same MCP server underneath. The differences are purely in agent runtime ergonomics.
