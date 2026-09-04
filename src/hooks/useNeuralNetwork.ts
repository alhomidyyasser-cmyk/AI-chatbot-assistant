import { useState, useCallback, useEffect, useRef } from "react";
import { NeuralNetwork, preprocessDataset, EpochResult, Intent } from "../utils/nn";
import { getBagOfWords } from "../utils/stemmer";
import { DEFAULT_INTENTS } from "../data/defaultIntents";

export interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  tag?: string;
  confidence?: number;
}

export function useNeuralNetwork() {
  const [intents, setIntents] = useState<Intent[]>(DEFAULT_INTENTS);
  const [neuralNet, setNeuralNet] = useState<NeuralNetwork | null>(null);
  const [vocab, setVocab] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [trainingHistory, setTrainingHistory] = useState<EpochResult[]>([]);
  const intentsRef = useRef(intents);

  useEffect(() => {
    intentsRef.current = intents;
  }, [intents]);

  useEffect(() => {
    let cancelled = false;

    const autoTrain = async () => {
      const data = preprocessDataset(intentsRef.current);
      const net = new NeuralNetwork(data.words.length, data.labels.length);

      const history: EpochResult[] = [];
      const lr = 0.15;
      const totalEpochs = 300;
      const yieldEvery = 10;

      for (let epoch = 1; epoch <= totalEpochs; epoch++) {
        let epochLoss = 0;
        let correct = 0;

        for (let idx = 0; idx < data.trainingVectors.length; idx++) {
          const { loss, predictions } = net.trainStep(
            data.trainingVectors[idx],
            data.outputRows[idx],
            lr
          );
          epochLoss += loss;

          const predIdx = predictions.indexOf(Math.max(...predictions));
          const targetIdx = data.outputRows[idx].indexOf(1);
          if (predIdx === targetIdx) correct++;
        }

        if (epoch % yieldEvery === 0 || epoch === totalEpochs) {
          history.push({
            epoch,
            loss: epochLoss / data.trainingVectors.length,
            accuracy: correct / data.trainingVectors.length,
          });
          setTrainingHistory([...history]);
          await new Promise((r) => setTimeout(r, 0));
        }

        if (cancelled) return;
      }

      setNeuralNet(net);
      setVocab(data.words);
      setClasses(data.labels);
      setIsModelTrained(true);
    };

    autoTrain();

    return () => {
      cancelled = true;
    };
  }, []);

  const getWeights = useCallback(() => {
    if (!neuralNet) return null;
    return neuralNet.getNetworkTopology();
  }, [neuralNet]);

  const trainModel = useCallback(
    async (epochsCount: number) => {
      setIsTraining(true);

      const data = preprocessDataset(intents);
      const net = new NeuralNetwork(data.words.length, data.labels.length);

      const history: EpochResult[] = [];
      const lr = 0.12;
      const chunk = Math.max(1, Math.round(epochsCount / 100));

      for (let epoch = 1; epoch <= epochsCount; epoch++) {
        let epochLoss = 0;
        let correct = 0;

        for (let idx = 0; idx < data.trainingVectors.length; idx++) {
          const { loss, predictions } = net.trainStep(
            data.trainingVectors[idx],
            data.outputRows[idx],
            lr
          );
          epochLoss += loss;

          const predIdx = predictions.indexOf(Math.max(...predictions));
          const targetIdx = data.outputRows[idx].indexOf(1);
          if (predIdx === targetIdx) correct++;
        }

        if (epoch % chunk === 0 || epoch === epochsCount) {
          history.push({
            epoch,
            loss: epochLoss / data.trainingVectors.length,
            accuracy: correct / data.trainingVectors.length,
          });
          setTrainingHistory([...history]);
          await new Promise((r) => setTimeout(r, 6));
        }
      }

      setNeuralNet(net);
      setVocab(data.words);
      setClasses(data.labels);
      setIsModelTrained(true);
      setIsTraining(false);
    },
    [intents]
  );

  const predict = useCallback(
    (text: string) => {
      if (!neuralNet || vocab.length === 0 || classes.length === 0) {
        return {
          reply: "النموذج لم يتم تدريبه بعد.",
          tag: null as string | null,
          confidence: 0,
          stemmedWords: [] as string[],
          confMap: {} as Record<string, number>,
        };
      }

      const { vector, stemmedWords } = getBagOfWords(text, vocab);
      const { out_act } = neuralNet.forward(vector);
      const maxIdx = out_act.indexOf(Math.max(...out_act));
      const confidence = out_act[maxIdx];
      const tag = classes[maxIdx];

      const confMap: Record<string, number> = {};
      classes.forEach((lbl, i) => {
        confMap[lbl] = out_act[i];
      });

      let reply = "عذراً، لم أفهم رسالتك. يرجى إعادة صياغتها.";
      if (confidence >= 0.8) {
        const match = intents.find((item) => item.tag === tag);
        if (match && match.responses.length > 0) {
          reply = match.responses[Math.floor(Math.random() * match.responses.length)];
        }
      }

      return { reply, tag, confidence, stemmedWords, confMap };
    },
    [neuralNet, vocab, classes, intents]
  );

  return {
    intents,
    setIntents,
    vocab,
    classes,
    isTraining,
    isModelTrained,
    trainingHistory,
    trainModel,
    predict,
    getWeights,
  };
}
