"use client";

import { useState } from "react";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";

import { bodyMetrics } from "@/data/site-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function classifyBmi(bmi) {
  if (bmi < 18.5) {
    return {
      label: "Underweight",
      tone: "text-amber-400",
      badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      recommendation: "Focus on Olympic Lifting & Hypertrophy with a caloric surplus to build dense muscle mass.",
      targetProgram: "Olympic Lifting & Power",
    };
  }
  if (bmi < 25) {
    return {
      label: "Normal Weight",
      tone: "text-emerald-400",
      badgeColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
      recommendation: "Maintain your optimal health with Functional Athletic Training and Core Mobility.",
      targetProgram: "Functional Athletic Turf",
    };
  }
  if (bmi < 30) {
    return {
      label: "Overweight",
      tone: "text-amber-400",
      badgeColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      recommendation: "Combine Cardio Conditioning & Combat Kickboxing to accelerate metabolic calorie burn.",
      targetProgram: "Cardio Conditioning & HIIT",
    };
  }
  return {
    label: "Obese",
    tone: "text-rose-500",
    badgeColor: "bg-rose-500/15 border-rose-500/30 text-rose-400",
    recommendation: "Low-impact cardio, guided functional circuits, and consistent coach nutrition advice will transform your health.",
    targetProgram: "Cardio Conditioning & HIIT",
  };
}

export function BmiCalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    const heightCm = Number.parseFloat(height);
    const weightKg = Number.parseFloat(weight);

    if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
      setError("Please enter a valid height (cm) and weight (kg).");
      setResult(null);
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    setError("");
    setResult({ value: bmi.toFixed(1), ...classifyBmi(bmi) });
  }

  return (
    <Card id="body-metrics" className="mx-auto w-full max-w-xl rounded-2xl border-border/80 bg-card/90 shadow-xl">
      <CardHeader className="p-6 pb-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-bold text-xs uppercase tracking-wider">
          <Activity className="h-4 w-4" />
          <span>Health Assessment</span>
        </div>
        <CardTitle className="font-display text-2xl font-extrabold uppercase tracking-tight">
          {bodyMetrics.title}
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-muted-foreground">
          {bodyMetrics.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 p-6 pt-2">
        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="bmi-height" className="text-xs font-semibold uppercase text-muted-foreground">
              Height (cm)
            </Label>
            <Input
              id="bmi-height"
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bmi-weight" className="text-xs font-semibold uppercase text-muted-foreground">
              Weight (kg)
            </Label>
            <Input
              id="bmi-weight"
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="e.g. 74"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full uppercase font-bold tracking-wider h-11 text-xs"
        >
          Calculate BMI
        </Button>

        {error && (
          <p role="alert" className="text-xs font-medium text-rose-500 text-center">
            {error}
          </p>
        )}

        {/* Visual Result Box */}
        {result && (
          <div className="space-y-4 rounded-xl border border-border bg-secondary/30 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs uppercase font-semibold text-muted-foreground tracking-wider">
                  Your Calculated BMI
                </span>
                <p className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                  {result.value}
                </p>
              </div>

              <div className={`rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${result.badgeColor}`}>
                {result.label}
              </div>
            </div>

            {/* BMI Scale Bar */}
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-1 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-400/80 rounded-l-full" title="Underweight (<18.5)" />
                <div className="bg-emerald-400/80" title="Normal (18.5 - 24.9)" />
                <div className="bg-amber-500/80" title="Overweight (25 - 29.9)" />
                <div className="bg-rose-500/80 rounded-r-full" title="Obese (≥30)" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold px-0.5">
                <span>&lt;18.5</span>
                <span>18.5–24.9</span>
                <span>25–29.9</span>
                <span>30+</span>
              </div>
            </div>

            {/* Custom Recommendation */}
            <div className="pt-3 border-t border-border/60 space-y-2">
              <div className="flex items-start gap-2 text-xs text-foreground/90 leading-relaxed">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{result.recommendation}</span>
              </div>
              <div className="pt-1 flex items-center justify-end">
                <a
                  href="#programs"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  <span>Explore {result.targetProgram}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
