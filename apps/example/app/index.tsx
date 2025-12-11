import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { parseMarkdown } from "react-native-nitro-markdown";
import { COMPLEX_MARKDOWN } from "../markdown-test-data";
import { Parser } from "commonmark";
import MarkdownIt from "markdown-it";
import { marked } from "marked";

// Generate a massive string (~237KB) to force the CPU to work
const REPEATED_MARKDOWN = COMPLEX_MARKDOWN.repeat(50);

export default function BenchmarkScreen() {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runBenchmark = () => {
    setLogs([]);
    setError(null);

    requestAnimationFrame(async () => {
      const results = [];

      try {
        // Test data info
        results.push(
          `📊 Testing ${(REPEATED_MARKDOWN.length / 1024).toFixed(
            1
          )}KB of complex markdown`
        );
        results.push("");

        // --- 1. BENCHMARK NITRO (C++) ---
        parseMarkdown("warmup");

        const startNitro = global.performance.now();
        const nitroAST = parseMarkdown(REPEATED_MARKDOWN);
        const endNitro = global.performance.now();
        const nitroTime = endNitro - startNitro;

        results.push(`🚀 Nitro (C++): ${nitroTime.toFixed(2)}ms`);

        // --- 2. BENCHMARK COMMONMARK.JS (Reference Implementation) ---
        const commonmarkParser = new Parser();
        commonmarkParser.parse("warmup");

        const startCommonMark = global.performance.now();
        const commonmarkAST = commonmarkParser.parse(REPEATED_MARKDOWN);
        const endCommonMark = global.performance.now();
        const commonmarkTime = endCommonMark - startCommonMark;

        results.push(`📋 CommonMark (JS): ${commonmarkTime.toFixed(2)}ms`);

        // --- 3. BENCHMARK MARKDOWN-IT (Heavyweight) ---
        const markdownItParser = new MarkdownIt();
        markdownItParser.render("warmup");

        const startMarkdownIt = global.performance.now();
        const markdownItHTML = markdownItParser.render(REPEATED_MARKDOWN);
        const endMarkdownIt = global.performance.now();
        const markdownItTime = endMarkdownIt - startMarkdownIt;

        results.push(`🏗️  Markdown-It (JS): ${markdownItTime.toFixed(2)}ms`);

        // --- 4. BENCHMARK MARKED (Speedster) ---
        marked.parse("warmup");

        const startMarked = global.performance.now();
        const markedHTML = marked.parse(REPEATED_MARKDOWN);
        const endMarked = global.performance.now();
        const markedTime = endMarked - startMarked;

        results.push(`💨 Marked (JS): ${markedTime.toFixed(2)}ms`);
        results.push("");

        // --- CALCULATE THE WINS ---
        const commonmarkSpeedup = (commonmarkTime / nitroTime).toFixed(1);
        const markdownItSpeedup = (markdownItTime / nitroTime).toFixed(1);
        const markedSpeedup = (markedTime / nitroTime).toFixed(1);

        results.push("🏆 SPEED COMPARISON:");
        results.push(`   Nitro vs CommonMark: ${commonmarkSpeedup}x faster`);
        results.push(`   Nitro vs Markdown-It: ${markdownItSpeedup}x faster`);
        results.push(`   Nitro vs Marked: ${markedSpeedup}x faster`);

        setLogs(results);
        console.log(results.join("\n"));
      } catch (e) {
        console.error("[Benchmark] Error:", e);
        setError(e instanceof Error ? e.message : "Unknown error");
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏁 The Ultimate Showdown</Text>
        <Text style={styles.subtitle}>
          Nitro (C++) vs Top 3 JavaScript Parsers
        </Text>
        <Text style={styles.dataSize}>
          Testing: {(REPEATED_MARKDOWN.length / 1024).toFixed(1)} KB of complex
          markdown
        </Text>
      </View>

      <Pressable style={styles.benchmarkButton} onPress={runBenchmark}>
        <Text style={styles.benchmarkText}>🏁 Run Ultimate Benchmark</Text>
      </Pressable>

      <ScrollView style={styles.resultsScroll}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Benchmark Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        ) : logs.length > 0 ? (
          <View style={styles.resultsContainer}>
            {logs.map((log, i) => (
              <Text
                key={i}
                style={[
                  styles.resultText,
                  log.includes("Nitro") && styles.nitroResult,
                  log.includes("CommonMark") && styles.commonmarkResult,
                  log.includes("Markdown-It") && styles.markdownitResult,
                  log.includes("Marked") && styles.markedResult,
                  log.includes("SPEED COMPARISON") && styles.comparisonHeader,
                  log.includes("faster") && styles.speedResult,
                ]}
              >
                {log}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.instructionText}>
            Tap "Run Ultimate Benchmark" to compare Nitro (C++) against the top
            3 JavaScript markdown parsers!
          </Text>
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
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  dataSize: {
    fontSize: 14,
    color: "#4ade80",
    fontFamily: "monospace",
  },
  benchmarkButton: {
    backgroundColor: "#4f46e5",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  benchmarkText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resultsScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsContainer: {
    paddingVertical: 20,
  },
  resultText: {
    fontSize: 18,
    fontFamily: "monospace",
    marginBottom: 12,
    lineHeight: 24,
  },
  nitroResult: {
    color: "#4ade80",
    fontWeight: "600",
  },
  commonmarkResult: {
    color: "#f87171",
    fontWeight: "600",
  },
  markdownitResult: {
    color: "#a855f7",
    fontWeight: "600",
  },
  markedResult: {
    color: "#06b6d4",
    fontWeight: "600",
  },
  comparisonHeader: {
    color: "#fbbf24",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  speedResult: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 20,
  },
  instructionText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 60,
    lineHeight: 24,
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
