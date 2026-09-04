import { useState, Dispatch, SetStateAction, FormEvent } from "react";
import { Intent } from "../utils/nn";
import { Plus, Trash2 } from "lucide-react";
import Card from "./ui/Card";
import SectionHeader from "./ui/SectionHeader";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface IntentsManagerProps {
  intents: Intent[];
  setIntents: Dispatch<SetStateAction<Intent[]>>;
}

export default function IntentsManager({ intents, setIntents }: IntentsManagerProps) {
  const [selectedTag, setSelectedTag] = useState(intents[0]?.tag ?? "");
  const [newTagInput, setNewTagInput] = useState("");
  const [newPatternInput, setNewPatternInput] = useState("");
  const [newResponseInput, setNewResponseInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [patternError, setPatternError] = useState("");
  const [responseError, setResponseError] = useState("");

  const currentIntent = intents.find((item) => item.tag === selectedTag);

  const addIntent = (e: FormEvent) => {
    e.preventDefault();
    const tag = newTagInput.trim().toLowerCase().replace(/\s+/g, "_");
    setTagError("");

    if (!tag) {
      setTagError("الرجاء إدخال اسم الفئة");
      return;
    }
    if (intents.some((i) => i.tag === tag)) {
      setTagError("هذه الفئة موجودة بالفعل");
      return;
    }

    setIntents([...intents, { tag, patterns: ["example"], responses: ["Default response."] }]);
    setSelectedTag(tag);
    setNewTagInput("");
  };

  const deleteIntent = (tag: string) => {
    if (intents.length <= 1) return;
    const filtered = intents.filter((i) => i.tag !== tag);
    setIntents(filtered);
    if (selectedTag === tag && filtered.length > 0) setSelectedTag(filtered[0].tag);
  };

  const addPattern = (e: FormEvent) => {
    e.preventDefault();
    const pat = newPatternInput.trim();
    setPatternError("");

    if (!pat) {
      setPatternError("الرجاء إدخال نمط");
      return;
    }
    if (!currentIntent) return;

    if (currentIntent.patterns.includes(pat)) {
      setPatternError("هذا النمط موجود بالفعل");
      return;
    }

    setIntents(
      intents.map((item) =>
        item.tag === selectedTag ? { ...item, patterns: [...item.patterns, pat] } : item
      )
    );
    setNewPatternInput("");
  };

  const deletePattern = (idx: number) => {
    if (!currentIntent || currentIntent.patterns.length <= 1) return;
    setIntents(
      intents.map((item) =>
        item.tag === selectedTag
          ? { ...item, patterns: item.patterns.filter((_, i) => i !== idx) }
          : item
      )
    );
  };

  const addResponse = (e: FormEvent) => {
    e.preventDefault();
    const res = newResponseInput.trim();
    setResponseError("");

    if (!res) {
      setResponseError("الرجاء إدخال رد");
      return;
    }
    if (!currentIntent) return;

    if (currentIntent.responses.includes(res)) {
      setResponseError("هذا الرد موجود بالفعل");
      return;
    }

    setIntents(
      intents.map((item) =>
        item.tag === selectedTag ? { ...item, responses: [...item.responses, res] } : item
      )
    );
    setNewResponseInput("");
  };

  const deleteResponse = (idx: number) => {
    if (!currentIntent || currentIntent.responses.length <= 1) return;
    setIntents(
      intents.map((item) =>
        item.tag === selectedTag
          ? { ...item, responses: item.responses.filter((_, i) => i !== idx) }
          : item
      )
    );
  };

  return (
    <Card className="p-5 flex flex-col gap-5">
      <SectionHeader
        title="قاموس النوايا (Intents)"
        icon={
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
          </svg>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tags List */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-semibold text-[var(--color-text-muted)]">الفئات:</span>
          <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto p-1.5 border border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] rounded-xl scrollbar-thin">
            {intents.map((item) => (
              <div
                key={item.tag}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedTag(item.tag)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedTag(item.tag); } }}
                className={`group px-3 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center justify-between transition-all ${
                  selectedTag === item.tag
                    ? "bg-[var(--color-accent)] text-[var(--color-surface-0)]"
                    : "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)]"
                }`}
              >
                <span className="font-mono truncate">{item.tag}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={selectedTag === item.tag ? "accent" : "default"}
                    size="sm"
                  >
                    {item.patterns.length}
                  </Badge>
                  <button
                    type="button"
                    aria-label={`حذف الفئة ${item.tag}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteIntent(item.tag);
                    }}
                    className={`p-1 rounded transition-colors ${
                      selectedTag === item.tag
                        ? "text-[var(--color-surface-0)]/70 hover:text-red-200"
                        : "opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-error)]"
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={addIntent} className="flex gap-2">
            <Input
              placeholder="new_tag"
              value={newTagInput}
              onChange={(e) => { setNewTagInput(e.target.value); setTagError(""); }}
              className="font-mono text-xs"
              aria-label="اسم الفئة الجديدة"
            />
            <Button type="submit" variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} aria-label="إضافة فئة جديدة">
              أضف
            </Button>
          </form>
          {tagError && <span className="text-[10px] text-[var(--color-error)]">{tagError}</span>}
        </div>

        {/* Patterns & Responses */}
        <div className="lg:col-span-8 bg-[var(--color-surface-2)]/30 border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col gap-5">
          {currentIntent ? (
            <>
              {/* Patterns */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  الأنماط لـ <Badge variant="accent" size="sm">{currentIntent.tag}</Badge>
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto p-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] rounded-xl scrollbar-thin">
                  {currentIntent.patterns.map((pat, i) => (
                    <div
                      key={i}
                      className="text-[11px] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] py-1 px-2.5 rounded-lg flex items-center gap-2 hover:border-[var(--color-accent)]/30 transition-colors"
                    >
                      <span>"{pat}"</span>
                      <button
                        type="button"
                        aria-label={`حذف النمط ${pat}`}
                        onClick={() => deletePattern(i)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={addPattern} className="flex gap-2">
                  <Input
                    value={newPatternInput}
                    onChange={(e) => { setNewPatternInput(e.target.value); setPatternError(""); }}
                    placeholder="نمط جديد..."
                    aria-label="نمط جديد"
                  />
                  <Button type="submit" variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} aria-label="إضافة نمط">
                    أضف
                  </Button>
                </form>
                {patternError && <span className="text-[10px] text-[var(--color-error)]">{patternError}</span>}
              </div>

              {/* Responses */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  الردود (يرد بأحدها عشوائياً):
                </span>
                <div className="flex flex-col gap-1 max-h-[120px] overflow-y-auto p-2 border border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] rounded-xl scrollbar-thin">
                  {currentIntent.responses.map((res, i) => (
                    <div
                      key={i}
                      className="text-[11px] bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] p-2 rounded-lg flex items-start justify-between gap-2 hover:border-[var(--color-accent)]/20 transition-colors"
                    >
                      <span className="flex-1 text-right leading-relaxed">{res}</span>
                      <button
                        type="button"
                        aria-label={`حذف الرد: ${res}`}
                        onClick={() => deleteResponse(i)}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-error)] p-1 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <form onSubmit={addResponse} className="flex gap-2">
                  <Input
                    value={newResponseInput}
                    onChange={(e) => { setNewResponseInput(e.target.value); setResponseError(""); }}
                    placeholder="رد جديد..."
                    aria-label="رد جديد"
                  />
                  <Button type="submit" variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} aria-label="إضافة رد">
                    أضف
                  </Button>
                </form>
                {responseError && <span className="text-[10px] text-[var(--color-error)]">{responseError}</span>}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-32 text-xs text-[var(--color-text-muted)]">
              اختر فئة للتعديل
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
