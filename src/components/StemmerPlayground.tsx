import { useState, useEffect } from "react";
import { tokenize, stem } from "../utils/stemmer";
import Card from "./ui/Card";
import SectionHeader from "./ui/SectionHeader";

interface StemmerPlaygroundProps {
  vocabulary: string[];
  lastInputText: string;
}

export default function StemmerPlayground({ vocabulary, lastInputText }: StemmerPlaygroundProps) {
  const [inputText, setInputText] = useState("مرحبا كيف حالك, can you help me?");

  useEffect(() => {
    if (lastInputText) setInputText(lastInputText);
  }, [lastInputText]);

  const tokens = tokenize(inputText);
  const stems = tokens.map((t) => stem(t));
  const matchCount = stems.filter((s) => vocabulary.includes(s)).length;

  const steps = [
    {
      label: "التقطيع الرمزي",
      sub: "Tokenizer",
      color: "accent",
      items: tokens,
      emptyMsg: "انتظار الكلمات...",
    },
    {
      label: "تجذير الكلمات",
      sub: "Stemmer",
      color: "warning",
      items: stems,
      emptyMsg: "انتظار الجذور...",
    },
    {
      label: "مقارنة القاموس",
      sub: "Vocabulary Match",
      color: "default",
      items: null,
      emptyMsg: null,
    },
  ];

  return (
    <Card className="p-5 flex flex-col gap-5">
      <SectionHeader
        title="معالجة اللغة (NLP Pipeline)"
        icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        }
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-[var(--color-text-muted)]">
          جرب كتابة أي عبارة:
        </label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="اكتب هنا..."
          aria-label="إدخال النص للمعالجة"
          className="w-full bg-[var(--color-surface-2)] text-[var(--color-text-primary)] text-sm border border-[var(--color-border-default)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent)]/50 focus:ring-1 focus:ring-[var(--color-accent)]/20 transition-all"
        />
      </div>

      {/* Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, si) => (
          <div
            key={si}
            className="bg-[var(--color-surface-2)]/60 border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col gap-3"
          >
            <div>
              <div className={`text-[11px] uppercase tracking-normal font-semibold font-sans ${
                step.color === "accent" ? "text-[var(--color-accent)]" :
                step.color === "warning" ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"
              }`}>
                الخطوة {si + 1}
              </div>
              <h4 className="text-xs font-semibold text-[var(--color-text-primary)] mt-0.5">
                {step.label}
              </h4>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">{step.sub}</p>
            </div>

            <div className="flex flex-wrap gap-1 mt-auto min-h-[40px]">
              {step.items !== null ? (
                step.items.length === 0 ? (
                  <span className="text-[11px] text-[var(--color-text-muted)] italic">
                    {step.emptyMsg}
                  </span>
                ) : (
                  step.items.map((item, i) => (
                    <span
                      key={`token-${i}`}
                      className={`inline-flex items-center gap-1.5 rounded-lg font-sans font-medium text-[12px] px-3 py-1 ${
                        step.color === "accent"
                          ? "bg-[var(--color-accent-glow)] text-[var(--color-accent)] border border-[var(--color-accent-border)]"
                          : step.color === "warning"
                          ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20"
                          : "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]"
                      }`}
                    >
                      {item}
                    </span>
                  ))
                )
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    <span className="font-sans text-[var(--color-accent)] font-bold">
                      {matchCount}
                    </span>{" "}
                    كلمة من {vocabulary.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Vector Grid */}
      <div className="bg-[var(--color-surface-2)]/40 border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            متجه الإدخال (Bag of Words)
          </span>
          <span className="inline-flex items-center gap-1 rounded-full font-sans font-medium text-[11px] px-2 py-0.5 bg-[var(--color-surface-3)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]">
            {vocabulary.length} خانة
          </span>
        </div>
        <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto p-1.5 border border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] rounded-lg">
          {vocabulary.map((word, i) => {
            const active = stems.includes(word);
            return (
              <div
                key={i}
                className={`text-[12px] px-2.5 py-1.5 rounded-lg font-sans transition-all ${
                  active
                    ? "bg-[var(--color-accent)] text-[var(--color-surface-0)] font-bold"
                    : "bg-[var(--color-surface-3)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]"
                }`}
                title={`${word}: ${active ? "1" : "0"}`}
              >
                {word}
                <span className={`ml-0.5 text-[8px] ${active ? "text-[var(--color-surface-0)]/70" : ""}`}>
                  :{active ? "1" : "0"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
