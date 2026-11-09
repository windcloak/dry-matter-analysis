"use client";

import { useState } from "react";
import Resources from "@/components/Resources";
import NutrientInput from "@/components/NutrientInput";

const composition = [
  { title: "Crude Protein", id: "protein" },
  { title: "Crude Fat", id: "fat" },
  { title: "Crude Fiber", id: "fiber" },
  { title: "Moisture", id: "moisture" },
  { title: "Ash", id: "ash" },
];

const ESTIMATED_ASH = { dry: 6, wet: 3 };

export default function Home() {
  const [values, setValues] = useState({
    protein: "",
    fat: "",
    fiber: "",
    moisture: "",
    ash: "",
  });

  const [results, setResults] = useState<{
    protein: number;
    fat: number;
    fiber: number;
    ash: number;
    carbs: number;
    ashEstimate: number | null; // the estimate used, or null if ash came from the label
    foodType: "dry" | "wet";
  } | null>(null);

  const [ashNotListed, setAshNotListed] = useState(false);
  // radio button for wet or dry food for Ash when Ash is not listed on the label
  const [foodType, setFoodType] = useState<"dry" | "wet">("dry");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Remove the given error messages, e.g. clearErrors("protein").
  // "...keys" (rest parameter) collects any number of arguments into an array.
  function clearErrors(...keys: string[]) {
    setErrors((prev) => {
      const next = { ...prev }; // copy, never change state directly
      for (const key of keys) delete next[key];
      return next;
    });
  }

  // Put everything back to how it was when the page first loaded
  function handleClear() {
    setValues({ protein: "", fat: "", fiber: "", moisture: "", ash: "" });
    setResults(null);
    setErrors({});
    setAshNotListed(false);
    setFoodType("dry");
  }

  function handleCalculate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    // Check each field on its own
    for (const item of composition) {
      if (item.id === "ash" && ashNotListed) continue; // ash is estimated, so skip it

      const raw = values[item.id as keyof typeof values];
      const num = Number(raw);

      if (raw.trim() === "" || isNaN(num)) {
        newErrors[item.id] = "Please enter a number.";
      } else if (num < 0) {
        newErrors[item.id] = "Can't be negative.";
      } else if (num >= 100) {
        newErrors[item.id] = "Must be less than 100.";
      }
    }

    const protein = Number(values.protein);
    const fat = Number(values.fat);
    const fiber = Number(values.fiber);
    const moisture = Number(values.moisture);
    const ash = ashNotListed ? ESTIMATED_ASH[foodType] : Number(values.ash);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setResults(null); // hide old results so they don't look current
      return; // stop before the math
    }

    const dryMatter = 100 - moisture;
    const proteinDM = (protein / dryMatter) * 100;
    const fatDM = (fat / dryMatter) * 100;
    const fiberDM = (fiber / dryMatter) * 100;
    const ashDM = (ash / dryMatter) * 100;
    const carbDM = 100 - (proteinDM + fatDM + fiberDM + ashDM);

    setResults({
      protein: proteinDM,
      fat: fatDM,
      fiber: fiberDM,
      ash: ashDM,
      carbs: carbDM,
      ashEstimate: ashNotListed ? ESTIMATED_ASH[foodType] : null,
      foodType: foodType,
    });
  }
  const compositionItems = composition.map((item) => (
    <NutrientInput
      key={item.id}
      id={item.id}
      label={`${item.title} (%)`}
      value={values[item.id as keyof typeof values]}
      onChange={(value) => {
        setValues({ ...values, [item.id]: value });
        clearErrors(item.id);
      }}
      error={errors[item.id]}
      disabled={item.id === "ash" && ashNotListed}
    >
      {/* only render these extra controls under the Ash input */}
      {item.id === "ash" && (
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-base text-primary-800">
            <input
              type="checkbox"
              className="accent-secondary-400"
              checked={ashNotListed}
              onChange={(e) => {
                setAshNotListed(e.target.checked);
                clearErrors("ash"); // ash is now typed or estimated
              }}
            />
            Ash is not listed
          </label>

          {/* Radio buttons only appear when the box is checked */}
          {ashNotListed && (
            <div className="flex gap-4 pl-6 text-base text-primary-800">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="foodType"
                  value="dry"
                  checked={foodType === "dry"}
                  onChange={() => setFoodType("dry")}
                  className="mt-1 accent-secondary-400"
                />
                <span>
                  Dry food
                  {/* the number comes from ESTIMATED_ASH, so it stays in sync */}
                  <span className="block text-sm text-primary-600">
                    Uses a {ESTIMATED_ASH.dry}% ash estimate
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="foodType"
                  value="wet"
                  checked={foodType === "wet"}
                  onChange={() => setFoodType("wet")}
                  className="mt-1 accent-secondary-400"
                />
                <span>
                  Wet food
                  {/* the number comes from ESTIMATED_ASH, so it stays in sync */}
                  <span className="block text-sm text-primary-600">
                    Uses a {ESTIMATED_ASH.wet}% ash estimate
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
      )}
    </NutrientInput>
  ));

  const resultRows = results
    ? [
        { name: "Protein", value: results.protein },
        { name: "Fat", value: results.fat },
        { name: "Carbohydrate", value: results.carbs },
        { name: "Fiber", value: results.fiber },
        { name: "Ash", value: results.ash },
      ]
    : [];

  const resultItems = resultRows.map((result) => (
    <li
      key={result.name}
      className="flex items-baseline justify-between border-b border-white/10 py-3"
    >
      <span className="text-lg font-bold text-primary-100">{result.name}</span>
      <span className="text-2xl font-semibold text-white">
        {result.value.toFixed(1)}
        <span className="ml-0.5 text-sm text-primary-300">%</span>
      </span>
    </li>
  ));

  return (
    <main className="max-w-5xl mx-auto px-4 py-3 text-primary-900">
      <div>
        <h1 className="text-4xl font-bold text-primary-900 sm:text-5xl py-2">
          Dry Matter Analysis Calculator
        </h1>
        <p className="text-3xl font-bold text-secondary-600">
          for Cat and Dog Food
        </p>
        <p className="mt-4 text-base text-pretty text-primary-700 sm:text-lg/relaxed">
          Remove water from the equation to compare wet and dry foods on an
          equal basis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 my-5 overflow-hidden rounded-3xl border border-primary-100 shadow-sm">
        <div className="flex flex-col bg-secondary-50 p-8">
          <form
            noValidate
            className="w-full max-w-sm mx-auto space-y-4"
            onSubmit={handleCalculate}
          >
            <div className="flex justify-end">
              {/* type="button" so clicking Clear doesn't submit the form */}
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full bg-primary-100 px-5 py-1.5 text-sm font-medium text-primary-800 transition-colors hover:bg-primary-200"
              >
                Clear
              </button>
            </div>
            {compositionItems}

            <button
              className="block w-full rounded-xl bg-secondary-600 px-12 py-3.5 text-lg font-semibold text-white transition-colors hover:bg-secondary-700"
              type="submit"
            >
              Calculate
            </button>

          </form>
        </div>
        <div className="flex flex-col bg-primary-900 p-8 text-white">
          {results && <ul>{resultItems}</ul>}
          {results && results.carbs < 0 && (
            <p className="mt-4 text-sm text-primary-200">
              Carbohydrates came out below 0%. Protein and fat on the label are
              minimums, and fiber, moisture and ash are maximums, so the numbers
              can add up to more than 100%. This food is very low in
              carbohydrates.
            </p>
          )}

          {results && results.ashEstimate !== null && (
            <p className="mt-4 text-sm text-primary-200">
              Ash wasn&apos;t listed, so we used an estimate of {results.ashEstimate}
              % for {results.foodType} food.
            </p>
          )}
        </div>
      </div>

      <Resources />
    </main>
  );
}
