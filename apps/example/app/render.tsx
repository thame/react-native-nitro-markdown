import { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  parseMarkdown,
  type MarkdownNode,
} from 'react-native-nitro-markdown';
import { MarkdownRenderer } from '../components/markdown-renderer';

const DEMO_MARKDOWN = `# 🚀 Nitro Markdown Comprehensive Demo

Welcome to the **high-performance** markdown parser powered by \`md4c\` and **Nitro Modules**.

## 📝 Complete Feature Showcase

This parser supports **every** markdown feature you'd expect and more!

### Basic Text Formatting

- **Bold text** with double asterisks
- *Italic text* with single asterisks
- ***Bold italic*** with triple asterisks
- ~~Strikethrough text~~ (GFM)
- \`Inline code\` snippets
- Combined: **bold with *italic* and \`code\`**

### Links and Images

#### Links
- [Basic link](https://github.com)
- [Link with title](https://github.com "GitHub Repository")
- [Reference style][ref-link]

#### Images
- ![Landscape](https://picsum.photos/300/200 "Random image from Picsum")
- ![City](https://picsum.photos/seed/markdown/300/150 "City skyline")

### Advanced Tables (GFM)

#### Table with All Alignments
| Left Aligned | Center Aligned | Right Aligned | Default |
|:-------------|:--------------:|--------------:|---------|
| Left 1       | Center 1       | Right 1       | Default 1 |
| Left 2       | Center 2       | Right 2       | Default 2 |
| **Bold**     | *Italic*       | \`Code\`      | ~~Strike~~ |

#### Complex Table Content
| Feature | Description | Status |
|:--------|:------------|:-------|
| JSI Binding | Direct JS ↔️ C++ | ✅ |
| Native Threading | Background processing | ✅ |
| Zero-Copy | No data duplication | ✅ |
| Math Support | LaTeX expressions | ✅ |
| GFM Tables | Advanced tables | ✅ |

### Task Lists (GFM)

- [x] Implement md4c parser
- [x] Create Nitro bindings
- [x] Build AST converter
- [x] Add comprehensive tests
- [ ] Add syntax highlighting
- [ ] Implement caching
- [ ] Add custom renderers

### Code Blocks with Languages

#### TypeScript
\`\`\`typescript
import { parseMarkdown, parseMarkdownWithOptions } from 'react-native-nitro-markdown';

interface ParserOptions {
  gfm?: boolean;
  math?: boolean;
}

const parseWithGFM = (text: string): MarkdownNode => {
  return parseMarkdownWithOptions(text, {
    gfm: true,
    math: true
  });
};
\`\`\`

#### C++ (Native Implementation)
\`\`\`cpp
#include "MD4CParser.hpp"

std::shared_ptr<MarkdownNode> parseMarkdown(
    const std::string& text,
    const ParserOptions& options
) {
    MD4CParser parser;
    return parser.parse(text, options);
}
\`\`\`

#### Python (for comparison)
\`\`\`python
# Traditional Python markdown parsing
import markdown

def parse_md(text: str) -> str:
    return markdown.markdown(text)
\`\`\`

#### No Language Specified
\`\`\`
This is a code block without language highlighting.
It can contain any text including:
- Lists
- Special characters: @#$%^&*()
- Unicode: 🚀 🌟 💻
\`\`\`

### Advanced Math Support (LaTeX)

#### Inline Math
- Simple: $E = mc^2$
- Complex: $\\frac{d}{dx}[x^n] = nx^{n-1}$
- Greek letters: $\\alpha + \\beta = \\gamma$
- Subscripts: $x_1, x_2, \\dots, x_n$
- Superscripts: $x^2, y^{n+1}, e^{\\pi i}$

#### Block Math (Display Mode)
The quadratic formula:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Pythagorean theorem with proof:

$$a^2 + b^2 = c^2$$

Matrix operations:

$$\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\times \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}$$

### Blockquotes (All Levels)

#### Single Level
> "Any sufficiently advanced technology is indistinguishable from magic."
>
> — Arthur C. Clarke

#### Nested Blockquotes
> First level quote
>
> > Second level quote
> >
> > > Third level quote
> > > With multiple lines
> >
> > Back to second level
>
> Back to first level

### Lists (Ordered & Unordered)

#### Unordered Lists
- Simple item
- **Bold item**
- *Italic item*
- \`Code item\`
- [Link item](https://example.com)
- ~~Strikethrough item~~

#### Ordered Lists
1. First ordered item
2. Second ordered item
   - Nested unordered
   - Another nested
3. Third item
   1. Nested ordered
   2. Another nested ordered
      - Deep nesting
      - More deep nesting

#### Mixed Lists
1. Ordered item 1
   - Unordered sub-item
   - Another unordered
2. Ordered item 2
   1. Nested ordered
   2. Another nested
   - Mixed unordered

### Horizontal Rules

Content above

---

Content below

---

Alternative style

***

Another alternative

___

### Headings (All Levels)

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading

### Headings with Formatting

# **Bold H1** with *italic* and \`code\`
## ~~Strikethrough H2~~
### H3 with [link](https://example.com)
#### H4 with $E = mc^2$

### Unicode and Emoji Support

#### International Characters
- Español: Hola mundo 🌍
- Français: Bonjour le monde 🌟
- Deutsch: Hallo Welt 🚀
- 中文: 你好世界 💻
- 日本語: こんにちは世界 🎌

#### Emoji Combinations
- 🚀 + 💻 + ⚡ = High-performance computing
- 🌍 + 🌐 + 🔗 = Global connectivity
- 📱 + 🖥️ + ⌚ = Cross-platform development

### Edge Cases & Advanced Scenarios

#### Empty Elements
- Empty paragraph:

- Another empty:

#### Special Characters
- HTML entities: &amp; &lt; &gt; &quot; &#39;
- Special symbols: © ® ™ ° § ¶ † ‡
- Currency: $ € ¥ £ ₽ ₿

#### Long Lines
This is an extremely long line that should test how the parser handles very long content without breaking or causing performance issues. It contains various types of content including **bold text**, *italic text*, \`inline code\`, and even some $mathematical expressions$ to ensure everything renders correctly regardless of line length.

#### Mixed Content
Here's a paragraph with **bold**, *italic*, ~~strikethrough~~, \`code\`, [links](https://example.com), and $math$ all mixed together in one sentence to test parsing complexity.

### Performance Characteristics

- **Synchronous parsing** on JS thread via JSI
- **Zero bridge communication** overhead
- **Native C++ performance** with md4c
- **Memory efficient** with shared pointers
- **Thread safe** implementation

*Typical parse times: **microseconds** for complex documents!*

---

[ref-link]: https://github.com/margelo/react-native-nitro-modules "Nitro Modules"
`;

export default function RenderScreen() {
  const [ast, setAst] = useState<MarkdownNode | null>(null);
  const [parseTime, setParseTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const start = global.performance.now();
      const result = parseMarkdown(DEMO_MARKDOWN);
      const end = global.performance.now();
      setAst(result);
      setParseTime(end - start);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  }, []);

  return (
    <View style={styles.container}>
      {parseTime !== null && (
        <View style={styles.parseTimeBar}>
          <Text style={styles.parseTimeText}>
            ⚡ Parsed in {parseTime.toFixed(2)}ms
          </Text>
        </View>
      )}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Parse Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : ast ? (
          <MarkdownRenderer node={ast} />
        ) : (
          <Text style={styles.loadingText}>Parsing markdown...</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  parseTimeBar: {
    backgroundColor: '#1a2e1a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d4a2d',
  },
  parseTimeText: {
    color: '#4ade80',
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 60,
  },
  errorBox: {
    backgroundColor: '#2d1b1b',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#7f1d1d',
  },
  errorTitle: {
    color: '#fca5a5',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorMessage: {
    color: '#fca5a5',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});
