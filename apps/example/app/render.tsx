import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { parseMarkdown, type MarkdownNode } from "react-native-nitro-markdown";
import { MarkdownRenderer } from "../components/markdown-renderer";
import { COMPLEX_MARKDOWN } from "../markdown-test-data";

export default function RenderScreen() {
  const [ast, setAst] = useState<MarkdownNode | null>(null);
  const [parseTime, setParseTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const start = global.performance.now();
      const result = parseMarkdown(COMPLEX_MARKDOWN);
      const end = global.performance.now();
      setAst(result);
      setParseTime(end - start);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
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
    backgroundColor: "#0a0a0a",
  },
  parseTimeBar: {
    backgroundColor: "#1a2e1a",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2d4a2d",
  },
  parseTimeText: {
    color: "#4ade80",
    fontSize: 14,
    fontFamily: "monospace",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 60,
  },
  errorBox: {
    backgroundColor: "#2d1b1b",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#7f1d1d",
  },
  errorTitle: {
    color: "#fca5a5",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorMessage: {
    color: "#fca5a5",
    fontSize: 14,
    fontFamily: "monospace",
  },
});
