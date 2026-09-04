import { tokenize, stem } from "./stemmer";

export interface Intent {
  tag: string;
  patterns: string[];
  responses: string[];
}

export interface TrainingData {
  words: string[];
  labels: string[];
  trainingVectors: number[][];
  outputRows: number[][];
}

export interface EpochResult {
  epoch: number;
  loss: number;
  accuracy: number;
}

export class NeuralNetwork {
  private w1: number[][];
  private b1: number[];
  private w2: number[][];
  private b2: number[];
  private w3: number[][];
  private b3: number[];

  constructor(private inputSize: number, private outputSize: number) {
    this.w1 = this.initWeights(8, inputSize);
    this.b1 = new Array(8).fill(0);
    this.w2 = this.initWeights(8, 8);
    this.b2 = new Array(8).fill(0);
    this.w3 = this.initWeights(outputSize, 8);
    this.b3 = new Array(outputSize).fill(0);
  }

  private initWeights(rows: number, cols: number): number[][] {
    const scale = Math.sqrt(2.0 / (rows + cols));
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => (Math.random() * 2 - 1) * scale)
    );
  }

  private relu(x: number): number {
    return Math.max(0, x);
  }

  private reluDerivative(x: number): number {
    return x > 0 ? 1 : 0;
  }

  private softmax(arr: number[]): number[] {
    const maxVal = Math.max(...arr);
    const exps = arr.map((x) => Math.exp(x - maxVal));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map((x) => x / (sumExps || 1));
  }

  public forward(input: number[]) {
    const h1: number[] = [...this.b1];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        h1[i] += input[j] * this.w1[i][j];
      }
    }
    const h1_act = h1.map(this.relu);

    const h2: number[] = [...this.b2];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        h2[i] += h1_act[j] * this.w2[i][j];
      }
    }
    const h2_act = h2.map(this.relu);

    const out: number[] = [...this.b3];
    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < 8; j++) {
        out[i] += h2_act[j] * this.w3[i][j];
      }
    }
    const out_act = this.softmax(out);

    return { h1, h1_act, h2, h2_act, out, out_act };
  }

  public trainStep(input: number[], target: number[], lr: number = 0.05) {
    const { h1, h1_act, h2, h2_act, out_act } = this.forward(input);

    let loss = 0;
    for (let i = 0; i < this.outputSize; i++) {
      loss -= target[i] * Math.log(Math.max(out_act[i], 1e-15));
    }

    const dOut = out_act.map((val, i) => val - target[i]);

    const dw3: number[][] = Array.from({ length: this.outputSize }, () => new Array(8).fill(0));
    const db3 = [...dOut];
    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < 8; j++) {
        dw3[i][j] = dOut[i] * h2_act[j];
      }
    }

    const dH2_act = new Array(8).fill(0);
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < this.outputSize; i++) {
        dH2_act[j] += dOut[i] * this.w3[i][j];
      }
    }
    const dH2 = h2.map((x, j) => dH2_act[j] * this.reluDerivative(x));

    const dw2: number[][] = Array.from({ length: 8 }, () => new Array(8).fill(0));
    const db2 = [...dH2];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        dw2[i][j] = dH2[i] * h1_act[j];
      }
    }

    const dH1_act = new Array(8).fill(0);
    for (let j = 0; j < 8; j++) {
      for (let i = 0; i < 8; i++) {
        dH1_act[j] += dH2[i] * this.w2[i][j];
      }
    }
    const dH1 = h1.map((x, j) => dH1_act[j] * this.reluDerivative(x));

    const dw1: number[][] = Array.from({ length: 8 }, () => new Array(this.inputSize).fill(0));
    const db1 = [...dH1];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        dw1[i][j] = dH1[i] * input[j];
      }
    }

    const clip = 5.0;
    const clipVal = (v: number) => Math.max(-clip, Math.min(clip, v));

    for (let i = 0; i < this.outputSize; i++) {
      this.b3[i] -= lr * clipVal(db3[i]);
      for (let j = 0; j < 8; j++) {
        this.w3[i][j] -= lr * clipVal(dw3[i][j]);
      }
    }

    for (let i = 0; i < 8; i++) {
      this.b2[i] -= lr * clipVal(db2[i]);
      for (let j = 0; j < 8; j++) {
        this.w2[i][j] -= lr * clipVal(dw2[i][j]);
      }
    }

    for (let i = 0; i < 8; i++) {
      this.b1[i] -= lr * clipVal(db1[i]);
      for (let j = 0; j < this.inputSize; j++) {
        this.w1[i][j] -= lr * clipVal(dw1[i][j]);
      }
    }

    return { loss, predictions: out_act };
  }

  public getNetworkTopology() {
    return { w1: this.w1, w2: this.w2, w3: this.w3 };
  }
}

export function preprocessDataset(intents: Intent[]): TrainingData {
  let words: string[] = [];
  const labels: string[] = [];
  const docsX: string[][] = [];
  const docsY: string[] = [];

  for (const intent of intents) {
    if (!labels.includes(intent.tag)) {
      labels.push(intent.tag);
    }
    for (const pattern of intent.patterns) {
      const wrds = tokenize(pattern);
      words.push(...wrds);
      docsX.push(wrds);
      docsY.push(intent.tag);
    }
  }

  words = Array.from(new Set(words.map((w) => stem(w)))).sort();

  const trainingVectors: number[][] = [];
  const outputRows: number[][] = [];
  const outEmpty = new Array(labels.length).fill(0);

  for (let idx = 0; idx < docsX.length; idx++) {
    const docStems = docsX[idx].map((w) => stem(w));
    const bag = words.map((w) => (docStems.includes(w) ? 1 : 0));
    trainingVectors.push(bag);

    const outputRow = [...outEmpty];
    const labelIdx = labels.indexOf(docsY[idx]);
    if (labelIdx !== -1) outputRow[labelIdx] = 1;
    outputRows.push(outputRow);
  }

  return { words, labels, trainingVectors, outputRows };
}
