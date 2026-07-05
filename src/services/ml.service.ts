import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export interface InferenceFeatures {
  supplier_id: string;
  avg_revenue: number;
  avg_expenses: number;
  avg_cash_flow: number;
  avg_margin: number;
  avg_current_ratio: number;
  avg_debt_ratio: number;
  avg_working_capital: number;
  rev_trend: number;
  avg_delay: number;
  max_delay: number;
  late_rate: number;
  avg_inspect: number;
  avg_defect: number;
  avg_return: number;
  total_complaints: number;
  gst_compliant: number;
  iso9001: number;
  iso14001: number;
  avg_audit: number;
  total_violations: number;
  event_count: number;
  event_impact: number;
}

export interface InferenceResult {
  trust_score: number;
  risk_level: string;
  failure_probability: number;
  delivery_delay_prediction: number;
  explanations: string[];
}

export const runInference = (features: InferenceFeatures): Promise<InferenceResult> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(process.cwd(), 'ml/predict.py');
    const venvPythonPath = path.resolve(process.cwd(), 'venv/bin/python');
    const pythonCmd = fs.existsSync(venvPythonPath) ? venvPythonPath : 'python3';
    const pythonProcess = spawn(pythonCmd, [scriptPath]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}. Error: ${errorData}`));
        return;
      }
      try {
        const result = JSON.parse(outputData);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result as InferenceResult);
        }
      } catch (err) {
        reject(new Error(`Failed to parse Python response: ${outputData}. Parse error: ${err}`));
      }
    });

    // Write input JSON to stdin
    pythonProcess.stdin.write(JSON.stringify(features));
    pythonProcess.stdin.end();
  });
};
