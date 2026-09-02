export const config = {
  port: Number(process.env.PORT || 3000),

  ai: {
    defaultProvider:
      process.env.AI_PROVIDER || "local",

    model:
      process.env.AI_MODEL || "default",

    timeoutMs:
      Number(process.env.AI_TIMEOUT_MS || 60000)
  },

  limits: {
    maxMessages: 50,
    maxMessageCharacters: 20000
  }
};
