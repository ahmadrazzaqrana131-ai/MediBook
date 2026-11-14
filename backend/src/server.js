const path = require("node:path");
const cors = require("cors");
const express = require("express");

const CHAT_LIMIT = 12;
const MESSAGE_LIMIT = 2000;
const CONVERSATION_LIMIT = 10000;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const DEFAULT_OPENROUTER_MODEL = "openrouter/free";
const OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const HEALTH_SYSTEM_PROMPT = `You are MediBook's general health information assistant.
Use clear, empathetic language. Provide general educational information only.
Do not diagnose, claim certainty about a user's condition, or prescribe medicines or dosages.
Encourage users to consult a qualified healthcare professional for personal advice.
If someone may be experiencing an emergency or immediate danger, tell them to contact
their local emergency services or go to the nearest emergency department now.
Do not request or repeat personal identifiers or sensitive health information.
If a question is outside your role, say so and suggest an appropriate professional.`;

class OpenRouterError extends Error {
  constructor(status) {
    super(`OpenRouter request failed with status ${status}.`);
    this.name = "OpenRouterError";
    this.status = status;
  }
}

function validateMessages(input) {
  if (!Array.isArray(input) || input.length === 0 || input.length > CHAT_LIMIT) {
    return { error: "Please send a conversation with up to 12 messages." };
  }

  const messages = [];
  let totalLength = 0;

  for (const [index, item] of input.entries()) {
    const expectedRole = index % 2 === 0 ? "user" : "assistant";

    if (
      !item ||
      typeof item !== "object" ||
      item.role !== expectedRole ||
      typeof item.content !== "string"
    ) {
      return { error: "Conversation messages must alternate between user and assistant." };
    }

   const content = item.content.trim();

const maxLength =
  item.role === "user" ? MESSAGE_LIMIT : CONVERSATION_LIMIT;

if (!content || content.length > maxLength) {
  return {
    error: item.role === "user"
      ? "Your message cannot exceed 2000 characters."
      : "AI response is too long. Please start a new conversation."
  };
}

    totalLength += content.length;
    if (totalLength > CONVERSATION_LIMIT) {
      return { error: "This conversation is too long. Please start a new one." };
    }

    messages.push({ role: item.role, content });
  }

  if (messages.at(-1).role !== "user") {
    return { error: "The last conversation message must be from the user." };
  }

  return { messages };
}

function isFreeModel(model) {
  return model === DEFAULT_OPENROUTER_MODEL || model.endsWith(":free");
}

function isConfiguredApiKey(apiKey) {
  return typeof apiKey === "string" &&
    apiKey.trim().length > 0 &&
    !apiKey.trim().startsWith("replace_with_");
}

function createOpenRouterReplyGenerator({
  apiKey,
  model = DEFAULT_OPENROUTER_MODEL,
  fetchImpl = globalThis.fetch
} = {}) {
  if (!isFreeModel(model)) {
    throw new Error("OPENROUTER_MODEL must be openrouter/free or a model ID ending in :free.");
  }

  return async function generateOpenRouterReply(messages) {
    const response = await fetchImpl(OPENROUTER_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-OpenRouter-Title": "MediBook"
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: HEALTH_SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 700,
        temperature: 0.4
      }),
      signal: AbortSignal.timeout(45_000)
    });

    if (!response.ok) {
      throw new OpenRouterError(response.status);
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (typeof content === "string") {
      return content.trim();
    }
    if (Array.isArray(content)) {
      return content
        .filter(part => part.type === "text" && typeof part.text === "string")
        .map(part => part.text)
        .join("\n")
        .trim();
    }
    return "";
  };
}

function createApp({
  apiKey = process.env.OPENROUTER_API_KEY,
  model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
  replyGenerator = createOpenRouterReplyGenerator({ apiKey, model }),
  allowedOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173"
} = {}) {
  const app = express();
  const origins = new Set(
    (Array.isArray(allowedOrigins) ? allowedOrigins : allowedOrigins.split(","))
      .map(origin => origin.trim())
      .filter(Boolean)
  );
  const requestCounts = new Map();
  let lastRateLimitCleanup = 0;

  app.use(cors({
    origin(origin, callback) {
      callback(null, !origin || origins.has(origin));
    }
  }));
  app.use(express.json({ limit: "32kb" }));

  app.get("/", (_request, response) => {
    response.json({ service: "MediBook API", status: "running" });
  });

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      aiConfigured: isConfiguredApiKey(apiKey),
      provider: "OpenRouter",
      model
    });
  });

  app.post("/api/chat", async (request, response) => {
    const now = Date.now();
    if (now - lastRateLimitCleanup >= RATE_WINDOW_MS) {
      for (const [client, limit] of requestCounts) {
        if (now >= limit.resetAt) requestCounts.delete(client);
      }
      lastRateLimitCleanup = now;
    }

    const address = request.ip || "unknown";
    let rate = requestCounts.get(address);

    if (!rate || now >= rate.resetAt) {
      rate = { count: 0, resetAt: now + RATE_WINDOW_MS };
      requestCounts.set(address, rate);
    }

    rate.count += 1;
    if (rate.count > RATE_LIMIT) {
      return response.status(429).json({
        error: "Too many messages. Please wait a minute and try again."
      });
    }

    const validated = validateMessages(request.body?.messages);
    if (validated.error) {
      return response.status(400).json({ error: validated.error });
    }

    if (!isConfiguredApiKey(apiKey)) {
      return response.status(503).json({
        error: "The AI assistant is not configured. Add OPENROUTER_API_KEY to backend/.env."
      });
    }

    try {
      const reply = await replyGenerator(validated.messages);
      if (typeof reply !== "string" || !reply.trim()) {
        return response.status(502).json({
          error: "The AI assistant returned an empty response. Please try again."
        });
      }

      return response.json({ reply: reply.trim() });
    } catch (error) {
      console.error(`AI provider request failed (${error.name || "Error"}).`);
      if (error instanceof OpenRouterError && error.status === 429) {
        return response.status(429).json({
          error: "OpenRouter's free-model rate limit was reached. Please wait and try again."
        });
      }
      if (error instanceof OpenRouterError && error.status === 402) {
        return response.status(503).json({
          error: "OpenRouter could not serve the free model for this account. Check your OpenRouter account status and try again."
        });
      }
      return response.status(502).json({
        error: "OpenRouter could not complete that request. Check the backend logs, API key, and free-model availability, then try again."
      });
    }
  });

  app.use((error, _request, response, next) => {
    if (response.headersSent) return next(error);

    if (error.type === "entity.too.large") {
      return response.status(413).json({ error: "The request is too large." });
    }

    if (error.type === "entity.parse.failed") {
      return response.status(400).json({ error: "The request must contain valid JSON." });
    }

    console.error(`API request failed (${error.name || "Error"}).`);
    return response.status(500).json({ error: "The server could not process the request." });
  });

  return app;
}

function startServer() {
  require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
  });

  const port = Number(process.env.PORT || 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid port number between 1 and 65535.");
  }

  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
  if (!isFreeModel(model)) {
    throw new Error("OPENROUTER_MODEL must be openrouter/free or a model ID ending in :free.");
  }

  const app = createApp({ model });
  const server = app.listen(port, () => {
    console.log(`MediBook API listening on http://localhost:${port}`);
    if (!isConfiguredApiKey(process.env.OPENROUTER_API_KEY)) {
      console.warn("AI is disabled. Configure OPENROUTER_API_KEY in backend/.env.");
    }
  });

  server.on("error", error => {
    console.error(`Backend startup failed: ${error.message}`);
    process.exitCode = 1;
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  createApp,
  createOpenRouterReplyGenerator,
  isConfiguredApiKey,
  isFreeModel,
  validateMessages
};
