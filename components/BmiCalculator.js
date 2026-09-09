"use client";

import { useState } from "react";
import { Ruler } from "lucide-react";

import { bodyMetrics } from "@/data/site-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function classifyBmi(bmi) {
  if (bmi < 18.5) return { label: "Underweight", tone: "text-warning" };
  if (bmi < 25) return { label: "Normal", tone: "text-emerald-400" };
  if (bmi < 30) return { label: "Overweight", tone: "text-warning" };
  return { label: "Obese", tone: "text-destructive" };
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
      setError("Enter a valid height and weight to calculate your BMI.");
      setResult(null);
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    setError("");
    setResult({ value: bmi.toFixed(1), ...classifyBmi(bmi) });
  }

  return (
    <Card id="body-metrics" className="mx-auto w-full max-w-md">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 uppercase">
          <Ruler className="h-4 w-4 text-primary" aria-hidden="true" />
          {bodyMetrics.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 sm:px-6">
        <div className="space-y-1.5">
          <Label htmlFor="bmi-height">Height (cm)</Label>
          <Input
            id="bmi-height"
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="e.g. 175"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bmi-weight">Weight (kg)</Label>
          <Input
            id="bmi-weight"
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="e.g. 82"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full uppercase tracking-wide"
        >
          Calculate
        </Button>

        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="rounded-lg border border-border bg-secondary/40 p-4 text-center">
            <p className="font-display text-3xl font-extrabold">
              {result.value}
            </p>
            <p
              className={cn(
                "mt-1 text-sm font-semibold uppercase tracking-wide",
                result.tone,
              )}
            >
              {result.label}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
