import { env, stderr, stdin, stdout } from "node:process";
import { createInterface } from "node:readline";
import { createZai } from "@ai-sdk/zai";
import { streamText, type ModelMessage } from "ai";

const {
  AGENT_API_KEY: apiKey,
  AGENT_MODEL: model = "glm-4.7-flash",
  AGENT_BASE_URL: baseURL = "https://open.bigmodel.cn/api/paas/v4/",
  AGENT_PROVIDER: provider = "zhipu",
} = env;

if (!apiKey) throw new Error("请在 packages/core/.env 中设置 AGENT_API_KEY。");
if (provider !== "zhipu") throw new Error("AGENT_PROVIDER 必须设为 zhipu。");

const chatModel = createZai({ apiKey, baseURL })(model);
const messages: ModelMessage[] = [];
const input = createInterface({ input: stdin, output: stdout, prompt: "你 > " });
let inputClosed = false;
input.once("close", () => {
  inputClosed = true;
});

try {
  if (stdin.isTTY) input.prompt();
  for await (const line of input) {
    const content = line.trim();
    if (content) {
      messages.push({ role: "user", content });
      const { stream } = streamText({ model: chatModel, messages, onError: () => undefined });
      let reply = "";
      for await (const part of stream) {
        if (part.type === "error") throw part.error;
        if (part.type === "text-delta") {
          stdout.write(part.text);
          reply += part.text;
        }
      }
      stdout.write("\n");
      messages.push({ role: "assistant", content: reply });
    }
    if (stdin.isTTY && !inputClosed) input.prompt();
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  stderr.write(`\n对话失败：${message.replaceAll(apiKey, "[redacted]")}\n`);
  process.exitCode = 1;
} finally {
  input.close();
}
