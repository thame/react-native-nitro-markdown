export * from "./headless";

/** Low-level renderer component for custom implementations */
export { DefaultMarkdownRenderer } from "./default-markdown-renderer";

/**
 * High-level Markdown component with optional custom renderers.
 * @example
 * ```tsx
 * <Markdown>{'# Hello World'}</Markdown>
 * ```
 */
export { Markdown } from "./markdown";

/**
 * Markdown component that supports streaming updates.
 */
export { MarkdownStream } from "./markdown-stream";

export { useMarkdownContext } from "./MarkdownContext";
export type {
  CustomRenderer,
  CustomRenderers,
  CustomRendererProps,
  NodeRendererProps,
} from "./MarkdownContext";

/** Default theme configuration */
export { defaultMarkdownTheme } from "./theme";
export type { MarkdownTheme } from "./theme";

// Individual renderers for custom compositions
export { Heading } from "./renderers/heading";
export { Paragraph } from "./renderers/paragraph";
export { Link } from "./renderers/link";
export { Blockquote } from "./renderers/blockquote";
export { HorizontalRule } from "./renderers/horizontal-rule";
export { CodeBlock, InlineCode } from "./renderers/code";
export { List, ListItem, TaskListItem } from "./renderers/list";
export { TableRenderer } from "./renderers/table";
export { Image } from "./renderers/image";
export { MathInline, MathBlock } from "./renderers/math";

// Streaming API
export { createMarkdownSession } from "./MarkdownSession";
export type { MarkdownSession } from "./MarkdownSession";
export { useMarkdownSession, useStream } from "./use-markdown-stream";
