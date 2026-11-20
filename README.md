# dudo

pnpm monorepo。`packages/core`（`@dudo/core`）是 TypeScript 库，由 Rslib 构建为 ESM 并生成类型声明，使用 Rstest 运行测试。工具版本统一维护在 `pnpm-workspace.yaml` 的 `catalog` 中。

开发环境使用 `.node-version` 锁定的 Node.js 26.13.1（LTS），以及 `package.json` 指定的 pnpm 版本。使用 fnm 时，在仓库根目录运行 `fnm install` 和 `fnm use` 即可切换到该版本。

```sh
pnpm install
pnpm check
pnpm build
```

如果本机的 `pnpm` 无法启动项目锁定的版本，可以用 `npm exec --yes --package=pnpm@12.22.0 -- pnpm install` 安装依赖，再用同样的前缀运行其他命令。

| 命令                                  | 用途                       |
| ------------------------------------- | -------------------------- |
| `pnpm lint`                           | 用 Oxlint 检查代码         |
| `pnpm format`                         | 用 Oxfmt 格式化文件        |
| `pnpm format:check`                   | 检查格式                   |
| `pnpm typecheck`                      | 检查 TypeScript 类型       |
| `pnpm test`                           | 运行工作区测试             |
| `pnpm --filter @dudo/core dev`        | 监听改动并构建 `core`      |
| `pnpm --filter @dudo/core test:watch` | 监听改动并运行 `core` 测试 |

新子包放在 `packages/` 下。其他子包可以用 `"@dudo/core": "workspace:*"` 引用 `core`，构建产物位于 `packages/core/dist/`。
