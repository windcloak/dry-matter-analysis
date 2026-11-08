"use client";

import { useState } from "react";

const composition = [
  { title: "Crude Protein", id: "protein" },
  { title: "Crude Fat", id: "fat" },
  { title: "Crude Fiber", id: "fiber" },
  { title: "Moisture", id: "moisture" },
  { title: "Ash", id: "ash" },
];

// Rough average ash values (as fed) to use when the label doesn't list ash. These are estimates
const ESTIMATED_ASH = { dry: 6, wet: 3 };

function Button() {
  return (
    <button
      className="block w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600"
      type="submit"
    >
      Calculate
    </button>
  );
}

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
    });
  }
  const compositionItems = composition.map((item) => (
    <div key={item.id} className="flex flex-col">
      <label
        className="block mb-2.5 text-sm font-medium text-heading"
        htmlFor={item.id}
      >
        {item.title} (%)
      </label>
      <input
        type="number"
        step="any"
        min="0"
        id={item.id}
        value={values[item.id as keyof typeof values]}
        onChange={(e) => {
          setValues({ ...values, [item.id]: e.target.value });
          // this field changed, so its error may be fixed
          clearErrors(item.id);
        }}
        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
        placeholder=""
        // when ash isn't listed, the ash input is greyed out and not required
        required={!(item.id === "ash" && ashNotListed)}
        disabled={item.id === "ash" && ashNotListed}
      />

      {errors[item.id] && (
        <p className="mt-1 text-sm text-red-600">{errors[item.id]}</p>
      )}

      {/* only render these extra controls under the Ash input */}
      {item.id === "ash" && (
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
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
            <div className="flex gap-4 pl-6 text-sm text-gray-700">
              <label className="flex items-start gap-2">
                <input
                  type="radio"
                  name="foodType"
                  value="dry"
                  checked={foodType === "dry"}
                  onChange={() => setFoodType("dry")}
                  className="mt-1"
                />
                <span>
                  Dry food
                  {/* the number comes from ESTIMATED_ASH, so it stays in sync */}
                  <span className="block text-xs text-gray-500">
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
                  className="mt-1"
                />
                <span>
                  Wet food
                  {/* the number comes from ESTIMATED_ASH, so it stays in sync */}
                  <span className="block text-xs text-gray-500">
                    Uses a {ESTIMATED_ASH.wet}% ash estimate
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  ));

  const resultRows = results
    ? [
        { name: "Protein", value: results.protein },
        { name: "Fat", value: results.fat },
        { name: "Fiber", value: results.fiber },
        { name: "Ash", value: results.ash },
        { name: "Carbohydrate", value: results.carbs },
      ]
    : [];

  const resultItems = resultRows.map((result) => (
    <li key={result.name}>
      {result.name}: {result.value.toFixed(1)}%
    </li>
  ));

  return (
    <main className="max-w-5xl mx-auto px-4 py-16">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl py-5">
          Dry Food Matter Analysis
        </h1>
        <h2 className="text-2xl font-bold text-gray-700">
          for Cat and Dog Food
        </h2>
        <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
          Remove moisture from the equation to compare the true nutrient content
          of wet and dry foods on an equal basis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 py-5">
        <div className="flex flex-col">
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
                className="rounded-full border border-gray-300 px-4 py-1 text-sm text-gray-700 hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
            {compositionItems}
            <Button />
          </form>
        </div>
        <div className="flex flex-col">
          {results ? (
            <ul className="space-y-2">{resultItems}</ul>
          ) : (
            <p className="text-gray-700">Enter values and click Calculate</p>
          )}

          {results && results.carbs < 0 && (
            <p className="mt-4 text-sm">
              Carbohydrates came out below 0%. Protein and fat on the label are
              minimums, and fiber, moisture and ash are maximums, so the numbers
              can add up to more than 100%. This food is very low in
              carbohydrates.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
