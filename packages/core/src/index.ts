import { createZai } from "@ai-sdk/zai";
import { streamText, type ModelMessage } from "ai";

type GlmAgentOptions = {
  apiKey: string;
  baseURL: string;
  model: string;
};

export function createGlmAgent({ apiKey, baseURL, model }: GlmAgentOptions) {
  const chatModel = createZai({ apiKey, baseURL })(model);

  return async function* streamReply(messages: ModelMessage[]) {
    const { stream } = streamText({ model: chatModel, messages, onError: () => undefined });

    for await (const part of stream) {
      if (part.type === "error") throw part.error;
      if (part.type === "text-delta") yield part.text;
    }
  };
}
