import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { useNeuralNetwork } from "./hooks/useNeuralNetwork";
import { useChat } from "./hooks/useChat";
import ChatSection from "./components/ChatSection";
import NetworkVis from "./components/NetworkVis";
import StemmerPlayground from "./components/StemmerPlayground";
import IntentsManager from "./components/IntentsManager";
import TrainingStats from "./components/TrainingStats";
import Card from "./components/ui/Card";
import ThemeToggle from "./components/ui/ThemeToggle";

type TabKey = "network" | "nlp" | "dataset" | "train";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "network", label: "الشبكة العصبية", icon: "🧠" },
  { key: "nlp", label: "معالجة اللغة", icon: "📊" },
  { key: "dataset", label: "البيانات", icon: "🏷️" },
  { key: "train", label: "التدريب", icon: "📈" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("network");
  const [activeStemmedWords, setActiveStemmedWords] = useState<string[]>([]);
  const [predictedTag, setPredictedTag] = useState<string | null>(null);
  const [predictionConfidence, setPredictionConfidence] = useState<Record<string, number>>({});
  const [lastInputText, setLastInputText] = useState("");

  const nn = useNeuralNetwork();
  const chat = useChat();

  const handleSendMessage = useCallback(async (text: string) => {
    setLastInputText(text);
    await chat.sendMessage(text, (t) => {
      const result = nn.predict(t);
      setActiveStemmedWords(result.stemmedWords);
      setPredictedTag(result.tag);
      setPredictionConfidence(result.confMap);
      return result;
    });
  }, [nn, chat]);

  const handleSelectSampleText = useCallback((text: string) => {
    setLastInputText(text);
    const result = nn.predict(text);
    setActiveStemmedWords(result.stemmedWords);
    setPredictedTag(result.tag);
    setPredictionConfidence(result.confMap);
  }, [nn]);

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)] text-[var(--color-text-primary)] flex flex-col font-sans antialiased bg-grid-pattern">
      {/* Header */}
      <header className="border-b border-[var(--color-border-subtle)] glass sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-blue-600 text-white shadow-lg shadow-[var(--color-accent)]/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <rect x="9" y="9" width="6" height="6" />
                <path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
              </svg>
            </div>
            <h1 className="text-sm font-bold text-[var(--color-text-primary)]">
              استوديو الشبكات العصبية
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] px-2.5 py-1 rounded-lg text-[11px] text-[var(--color-text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              يعمل محلياً
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-[1600px] mx-auto w-full">
        {/* Chat */}
        <div className="lg:col-span-4 flex flex-col min-h-[500px] min-w-0">
          <ChatSection
            onSendMessage={handleSendMessage}
            messages={chat.messages}
            isModelTrained={nn.isModelTrained}
            isTyping={chat.isTyping}
            onSelectSampleText={handleSelectSampleText}
          />
        </div>

        {/* Panels */}
        <div className="lg:col-span-8 flex flex-col gap-4 min-w-0">
          {/* Tabs */}
          <Card className="p-1.5">
            <div role="tablist" aria-label="أقسام التطبيق" className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  aria-controls={`panel-${tab.key}`}
                  tabIndex={activeTab === tab.key ? 0 : -1}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key ? "tab-active" : "tab-inactive"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Content */}
          <div className="flex-grow">
            {activeTab === "network" && (
              <motion.div
                id="panel-network"
                role="tabpanel"
                aria-label="الشبكة العصبية"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NetworkVis
                  vocabulary={nn.vocab}
                  labels={nn.classes}
                  activeStemmedWords={activeStemmedWords}
                  predictionConfidence={predictionConfidence}
                  predictedTag={predictedTag}
                  weights={nn.getWeights()}
                />
              </motion.div>
            )}

            {activeTab === "nlp" && (
              <motion.div
                id="panel-nlp"
                role="tabpanel"
                aria-label="معالجة اللغة"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <StemmerPlayground vocabulary={nn.vocab} lastInputText={lastInputText} />
              </motion.div>
            )}

            {activeTab === "dataset" && (
              <motion.div
                id="panel-dataset"
                role="tabpanel"
                aria-label="البيانات"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <IntentsManager intents={nn.intents} setIntents={nn.setIntents} />
              </motion.div>
            )}

            {activeTab === "train" && (
              <motion.div
                id="panel-train"
                role="tabpanel"
                aria-label="التدريب"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TrainingStats
                  onTrain={nn.trainModel}
                  isTraining={nn.isTraining}
                  trainingHistory={nn.trainingHistory}
                  labelsCount={nn.classes.length}
                  patternsCount={nn.vocab.length}
                />
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] py-3 px-6 text-center text-[11px] text-[var(--color-text-muted)] mt-auto">
        AI Chatbot Assistant — جميع العمليات تتم محلياً في المتصفح
      </footer>
    </div>
  );
}
