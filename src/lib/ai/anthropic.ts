/**
 * Simple server-side wrapper for Anthropic Claude completions.
 * Reads configuration from environment variables:
 * - ANTHROPIC_API_KEY
 * - ANTHROPIC_MODEL (defaults to claude-sonnet-4.5)
 * - ENABLE_CLAUDE_SONNET (must be "true" to enable)
 *
 * Usage: call from server-only code (endpoints, server routes).
 */

export interface ClaudeOptions {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

export async function createClaudeCompletion(options: ClaudeOptions) {
  const enabled = process.env.ENABLE_CLAUDE_SONNET === 'true';
  if (!enabled) throw new Error('Claude Sonnet is disabled (ENABLE_CLAUDE_SONNET=false)');

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY in environment');

  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4.5';

  const url = 'https://api.anthropic.com/v1/complete';

  const body = {
    model,
    prompt: options.prompt,
    max_tokens_to_sample: options.max_tokens ?? 512,
    temperature: options.temperature ?? 0.0
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${txt}`);
  }

  const data = await res.json();
  return data;
}

export default createClaudeCompletion;
