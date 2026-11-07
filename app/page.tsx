"use client";

import { useState } from "react";

const composition = [
  { title: "Crude Protein", id: "protein" },
  { title: "Crude Fat", id: "fat" },
  { title: "Crude Fiber", id: "fiber" },
  { title: "Moisture", id: "moisture" },
  { title: "Ash", id: "ash" },
];

// Rough average ash values (as fed) to use when the label doesn't list ash.
// Real foods vary, so results using these are estimates.
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


  const [ashNotListed, setAshNotListed] = useState(false);
  // radio button for wet or dry food for Ash when Ash is not listed on the label
  const [foodType, setFoodType] = useState<"dry" | "wet">("dry");

  function handleCalculate(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // stop the browser from reloading the page
    console.log(values); // try it: open DevTools → Console

    // NEW: use the estimate when ash isn't listed, otherwise what the user typed
    const ash = ashNotListed ? ESTIMATED_ASH[foodType] : Number(values.ash);
    console.log("ash used:", ash);
  }

  const compositionItems = composition.map((item) => (
    <div key={item.id} className="flex flex-col">
      <label className="block mb-2.5 text-sm font-medium text-heading">
        {item.title} (%)
      </label>
      <input
        type="number" step="any" min="0" max="100"
        id={item.id}
        value={values[item.id as keyof typeof values]}
  onChange={(e) => setValues({ ...values, [item.id]: e.target.value })}
        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
        placeholder=""
        // NEW: when ash isn't listed, the ash input is greyed out and not required
        required={!(item.id === "ash" && ashNotListed)}
        disabled={item.id === "ash" && ashNotListed}
      />

      {/* NEW: only render these extra controls under the Ash input */}
      {item.id === "ash" && (
        <div className="mt-2 space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={ashNotListed}
              onChange={(e) => setAshNotListed(e.target.checked)}
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
                  {/* NEW: the number comes from ESTIMATED_ASH, so it stays in sync */}
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
                  {/* NEW: the number comes from ESTIMATED_ASH, so it stays in sync */}
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
          <form className="w-full max-w-sm mx-auto space-y-4" onSubmit={handleCalculate}>
            {compositionItems}
            <Button />
          </form>
        </div>
        <div className="flex flex-col">Results here</div>
      </div>
    </main>
  );
}
