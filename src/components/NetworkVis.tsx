import { useMemo, useCallback } from "react";
import { useTheme } from "../hooks/useTheme";
import Card from "./ui/Card";
import SectionHeader from "./ui/SectionHeader";
import Badge from "./ui/Badge";

interface NetworkVisProps {
  vocabulary: string[];
  labels: string[];
  activeStemmedWords: string[];
  predictionConfidence: Record<string, number>;
  predictedTag: string | null;
  weights: {
    w1: number[][];
    w2: number[][];
    w3: number[][];
  } | null;
}

export default function NetworkVis({
  vocabulary,
  labels,
  activeStemmedWords,
  predictionConfidence,
  predictedTag,
  weights,
}: NetworkVisProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const width = 640;
  const height = 420;
  const hPadding = 40;
  const colWidth = (width - hPadding * 2) / 3;
  const col0 = hPadding;
  const col1 = hPadding + colWidth;
  const col2 = hPadding + colWidth * 2;
  const col3 = hPadding + colWidth * 3;

  const inputNodes = useMemo(() => {
    const active = vocabulary.filter((w) => activeStemmedWords.includes(w)).slice(0, 8);
    const inactive = vocabulary
      .filter((w) => !activeStemmedWords.includes(w))
      .slice(0, 8 - active.length);
    const visible = [...active, ...inactive].slice(0, 8);
    while (visible.length < 8) visible.push("...");
    return visible;
  }, [vocabulary, activeStemmedWords]);

  const getNodesInLayer = useCallback((x: number, count: number) => {
    const step = (height - 60) / (count - 1 || 1);
    return Array.from({ length: count }, (_, i) => ({ x, y: 30 + i * step }));
  }, []);

  const layer1 = useMemo(() => getNodesInLayer(col0, 8), [col0, getNodesInLayer]);
  const layer2 = useMemo(() => getNodesInLayer(col1, 8), [col1, getNodesInLayer]);
  const layer3 = useMemo(() => getNodesInLayer(col2, 8), [col2, getNodesInLayer]);
  const layer4 = useMemo(() => getNodesInLayer(col3, labels.length), [col3, labels.length, getNodesInLayer]);

  const colors = useMemo(() => ({
    synapseBase: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.06)",
    synapseActive: isDark ? "rgba(6, 182, 212, 0.3)" : "rgba(8, 145, 178, 0.35)",
    synapsePositive: isDark ? "rgba(6, 182, 212, 0.2)" : "rgba(8, 145, 178, 0.2)",
    synapseNegative: isDark ? "rgba(236, 72, 153, 0.12)" : "rgba(236, 72, 153, 0.15)",
    nodeInactive: isDark ? "#3f3f46" : "#cbd5e1",
    nodeStroke: isDark ? "#27272a" : "#94a3b8",
    nodeActiveFill: "#06b6d4",
    nodeActiveStroke: isDark ? "#67e8f9" : "#0891b2",
    labelInactive: isDark ? "#71717a" : "#64748b",
    labelActive: isDark ? "#67e8f9" : "#0891b2",
    hiddenFill: isDark ? "#3f3f46" : "#cbd5e1",
    hiddenStroke: isDark ? "#27272a" : "#94a3b8",
    outputFill: isDark ? "#3f3f46" : "#cbd5e1",
    outputStroke: isDark ? "#27272a" : "#94a3b8",
    outputActiveFill: "#06b6d4",
    outputActiveStroke: isDark ? "#67e8f9" : "#0891b2",
    outputSubFill: isDark ? "#3b82f6" : "#2563eb",
    outputSubStroke: isDark ? "#93c5fd" : "#3b82f6",
    labelText: isDark ? "#e0f2fe" : "#0f172a",
    labelMuted: isDark ? "#71717a" : "#64748b",
    winnerLabel: "#06b6d4",
  }), [isDark]);

  const getWeightColor = (v: number) => {
    if (v > 0.3) return colors.synapsePositive;
    if (v < -0.3) return colors.synapseNegative;
    return colors.synapseBase;
  };

  return (
    <Card className="p-4 flex flex-col">
      <SectionHeader
        title="خريطة التشابك العصبي"
        icon={
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-accent)]" />
          </span>
        }
      />

      <div className="flex gap-4 text-[10px] text-[var(--color-text-muted)] font-mono mt-3 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] opacity-60" />
          <span>مدخل نشط</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
          <span>تصنيف فائز</span>
        </div>
      </div>

      <div className="relative w-full overflow-auto flex justify-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[640px] h-auto">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="winnerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="activeSynapse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect
            x="0" y="0" width={width} height={height}
            className={isDark ? "" : "svg-network-bg"}
            fill={isDark ? "transparent" : "#f1f5f9"}
            rx="12"
          />

          {/* Synapse Lines */}
          <g>
            {layer1.map((c1, i1) => {
              const active = activeStemmedWords.includes(inputNodes[i1]);
              return layer2.map((c2, i2) => {
                const w = weights?.w1[i2]?.[i1] ?? 0.5;
                return (
                  <line
                    key={`s1-${i1}-${i2}`}
                    x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
                    stroke={active ? colors.synapseActive : getWeightColor(w)}
                    strokeWidth={active ? 1.5 : 0.6}
                  />
                );
              });
            })}
          </g>

          <g>
            {layer2.map((c2, i2) =>
              layer3.map((c3, i3) => {
                const w = weights?.w2[i3]?.[i2] ?? 0.5;
                return (
                  <line
                    key={`s2-${i2}-${i3}`}
                    x1={c2.x} y1={c2.y} x2={c3.x} y2={c3.y}
                    stroke={getWeightColor(w)}
                    strokeWidth={0.6}
                  />
                );
              })
            )}
          </g>

          <g>
            {layer3.map((c3, i3) =>
              layer4.map((c4, i4) => {
                const w = weights?.w3[i4]?.[i3] ?? 0.5;
                const win = predictedTag === labels[i4];
                return (
                  <line
                    key={`s3-${i3}-${i4}`}
                    x1={c3.x} y1={c3.y} x2={c4.x} y2={c4.y}
                    stroke={win ? colors.synapseActive : getWeightColor(w)}
                    strokeWidth={win ? 1.2 : 0.6}
                  />
                );
              })
            )}
          </g>

          {/* Active Pulses */}
          {layer1.map((c1, i1) => {
            const word = inputNodes[i1];
            if (!activeStemmedWords.includes(word)) return null;
            const winIdx = labels.findIndex((l) => l === predictedTag);
            if (winIdx === -1) return null;
            const c4 = layer4[winIdx];
            return (
              <path
                key={`pulse-${i1}`}
                d={`M ${c1.x} ${c1.y} C ${col1} ${c1.y}, ${col2} ${c4.y}, ${c4.x} ${c4.y}`}
                fill="none"
                stroke="url(#activeSynapse)"
                strokeWidth="1.5"
                className="animate-[dash_2s_linear_infinite]"
                style={{ strokeDasharray: "8 24" }}
              />
            );
          })}

          {/* Input Nodes */}
          {layer1.map((coord, i) => {
            const word = inputNodes[i];
            const active = activeStemmedWords.includes(word);
            return (
              <g key={`in-${i}`}>
                {active && <circle cx={coord.x} cy={coord.y} r={14} fill="url(#nodeGlow)" />}
                <circle
                  cx={coord.x} cy={coord.y}
                  r={active ? 5 : 3.5}
                  fill={active ? colors.nodeActiveFill : colors.nodeInactive}
                  stroke={active ? colors.nodeActiveStroke : colors.nodeStroke}
                  strokeWidth="1.5"
                />
                <text
                  x={coord.x - 10} y={coord.y + 3.5}
                  fill={active ? colors.labelActive : colors.labelInactive}
                  fontSize="8"
                  fontWeight={active ? "600" : "400"}
                  textAnchor="end"
                  className="font-mono pointer-events-none select-none"
                >
                  {word}
                </text>
              </g>
            );
          })}

          {/* Hidden Nodes */}
          {[layer2, layer3].map((layer, li) =>
            layer.map((coord, i) => (
              <circle
                key={`h${li}-${i}`}
                cx={coord.x} cy={coord.y}
                r={3.5}
                fill={colors.hiddenFill}
                stroke={colors.hiddenStroke}
                strokeWidth="1"
              />
            ))
          )}

          {/* Output Nodes */}
          {layer4.map((coord, i) => {
            const tag = labels[i];
            const isWinner = predictedTag === tag;
            const prob = predictionConfidence[tag] ?? 0;
            const r = 4 + prob * 7;

            return (
              <g key={`out-${i}`}>
                {isWinner && <circle cx={coord.x} cy={coord.y} r={r * 2.5} fill="url(#winnerGlow)" />}
                {!isWinner && prob > 0.05 && (
                  <circle cx={coord.x} cy={coord.y} r={r * 1.8} fill="url(#nodeGlow)" />
                )}
                <circle
                  cx={coord.x} cy={coord.y}
                  r={r}
                  fill={isWinner ? colors.outputActiveFill : prob > 0.05 ? colors.outputSubFill : colors.outputFill}
                  stroke={isWinner ? colors.outputActiveStroke : prob > 0.05 ? colors.outputSubStroke : colors.outputStroke}
                  strokeWidth="1.5"
                />
                <text
                  x={coord.x + 10} y={coord.y + 3.5}
                  fill={isWinner ? colors.winnerLabel : prob > 0.1 ? colors.labelText : colors.labelMuted}
                  fontSize="9"
                  fontWeight={isWinner ? "600" : "400"}
                  textAnchor="start"
                  className="font-sans pointer-events-none select-none"
                >
                  {tag}{" "}
                  <tspan fontSize="7" fill={colors.labelMuted}>
                    ({Math.round(prob * 100)}%)
                  </tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border-subtle)] pt-3 mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <span>التوقع:</span>
          <Badge variant="accent" size="sm">
            {predictedTag ?? "انتظار..."}
          </Badge>
        </div>
        <span className="text-[10px] font-mono">
          {vocabulary.length} × 8 × 8 × {labels.length}
        </span>
      </div>
    </Card>
  );
}
