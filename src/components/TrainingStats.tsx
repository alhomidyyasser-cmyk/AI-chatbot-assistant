import { useState } from "react";
import { EpochResult } from "../utils/nn";
import { Play, RotateCw, CheckCircle2 } from "lucide-react";
import Card from "./ui/Card";
import SectionHeader from "./ui/SectionHeader";
import MetricCard from "./ui/MetricCard";
import Button from "./ui/Button";

interface TrainingStatsProps {
  onTrain: (epochsCount: number) => Promise<void>;
  isTraining: boolean;
  trainingHistory: EpochResult[];
  labelsCount: number;
  patternsCount: number;
}

export default function TrainingStats({
  onTrain,
  isTraining,
  trainingHistory,
  labelsCount,
  patternsCount,
}: TrainingStatsProps) {
  const [epochs, setEpochs] = useState(500);

  const latest = trainingHistory[trainingHistory.length - 1] ?? {
    epoch: 0,
    loss: 1.95,
    accuracy: 0.12,
  };

  const getChartPoints = (metric: "loss" | "accuracy") => {
    if (trainingHistory.length === 0) return "";
    const w = 500;
    const h = 140;
    const maxE = Math.max(...trainingHistory.map((p) => p.epoch));
    const maxV = metric === "loss" ? Math.max(...trainingHistory.map((p) => p.loss), 1.0) : 1.0;

    return trainingHistory
      .map((p) => {
        const x = maxE > 0 ? (p.epoch / maxE) * w : 0;
        const v = metric === "loss" ? p.loss : p.accuracy;
        const y = h - (v / maxV) * h;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const accuracyPoints = getChartPoints("accuracy");
  const lossPoints = getChartPoints("loss");

  return (
    <Card className="p-5 flex flex-col gap-5">
      <SectionHeader
        title="تدريب النموذج"
        icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricCard
          label="الدورات"
          value={isTraining ? `${latest.epoch} / ${epochs}` : latest.epoch || "0"}
        />
        <MetricCard
          label="الخسارة"
          value={latest.loss.toFixed(4)}
        />
        <MetricCard
          label="الدقة"
          value={`${Math.round(latest.accuracy * 100)}%`}
          accent
        />
      </div>

      {/* Controls */}
      <div className="bg-[var(--color-surface-2)]/40 p-4 border border-[var(--color-border-subtle)] rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            الدورات المطلوبة:
          </span>
          <select
            value={epochs}
            disabled={isTraining}
            onChange={(e) => setEpochs(Number(e.target.value))}
            aria-label="عدد الدورات المطلوبة"
            className="bg-[var(--color-surface-0)] text-[var(--color-text-primary)] text-xs border border-[var(--color-border-default)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[var(--color-accent)]/50 font-mono"
          >
            <option value="100">100 (سريع)</option>
            <option value="300">300 (متوسط)</option>
            <option value="500">500 (موصى به)</option>
            <option value="1000">1000 (أعلى دقة)</option>
          </select>
        </div>

        <Button
          variant="primary"
          size="md"
          disabled={isTraining}
          loading={isTraining}
          onClick={() => onTrain(epochs)}
          aria-label={isTraining ? "جاري التدريب" : "بدء تدريب النموذج"}
          icon={!isTraining ? <Play className="w-4 h-4" /> : <RotateCw className="w-4 h-4 animate-spin" />}
        >
          {isTraining ? "جاري التدريب..." : "بدء التدريب"}
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {[
          { label: "الدقة", points: accuracyPoints, color: "#06b6d4", target: "100%" },
          { label: "الخسارة", points: lossPoints, color: "#ef4444", target: "0.000" },
        ].map((chart) => (
          <div key={chart.label} className="bg-[var(--color-surface-2)]/30 border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                {chart.label}
              </span>
              <span className="text-[11px] font-mono" style={{ color: chart.color }}>
                الهدف: {chart.target}
              </span>
            </div>
            <div className="relative h-[140px] w-full border-b border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/60 overflow-hidden flex items-end">
              {trainingHistory.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
                  اضغط التدريب لعرض المنحنى
                </div>
              ) : (
                <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
                  {[35, 70, 105].map((y) => (
                    <line
                      key={y}
                      x1="0" y1={y} x2="500" y2={y}
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  ))}
                  <polyline
                    fill="none"
                    stroke={chart.color}
                    strokeWidth="2"
                    points={chart.points}
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-[var(--color-surface-0)] rounded-xl border border-[var(--color-border-subtle)] p-4 font-mono text-[11px] text-[var(--color-text-muted)] flex flex-col gap-2">
        <span className="text-xs font-semibold text-[var(--color-text-secondary)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
          سجلات التدريب
        </span>
        <div className="bg-[var(--color-surface-2)]/40 border border-[var(--color-border-subtle)] rounded p-3 h-24 overflow-y-auto flex flex-col gap-1 select-text text-left scrollbar-thin">
          {trainingHistory.length === 0 ? (
            <span className="text-[var(--color-text-muted)] italic">في انتظار التدريب...</span>
          ) : (
            <>
              <div>[معلومة] القاموس: {patternsCount} جذر</div>
              <div>[معلومة] الفئات: {labelsCount} تصنيف</div>
              {trainingHistory.slice(-5).map((pt, i) => (
                <div key={i} className="text-[var(--color-text-secondary)]">
                  الدورة {pt.epoch}/{epochs} - الخسارة: {pt.loss.toFixed(4)} - الدقة: {Math.round(pt.accuracy * 100)}%
                </div>
              ))}
              {latest.epoch === epochs && (
                <div className="text-[var(--color-success)] font-bold flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>اكتمل التدريب!</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
