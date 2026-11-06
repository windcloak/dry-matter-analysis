import Image from "next/image";

const composition = [
  { title: "Crude protein", id: "crude-protein" },
  { title: "Crude Fat", id: "crude-fat" },
  { title: "Crude fiber", id: "crude-fiber" },
  { title: "Moisture", id: "moisture" },
  { title: "Ash", id: "ash" },
];

export default function Home() {
  const compositionItems = composition.map((item) => (
    <div>
      <label className="block mb-2.5 text-sm font-medium text-heading">
        {item.title}
      </label>
      <input
        type="number"
        id={item.id}
        className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
        placeholder=""
        required
      />
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
      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          <form className="max-w-sm mx-auto space-y-4">
            {compositionItems}
            <button
              className="block w-full rounded-lg border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition-colors hover:bg-transparent hover:text-indigo-600"
              type="submit"
            >
              Calculate
            </button>
          </form>
        </div>
        <div className="flex flex-col">Results here</div>
      </div>
    </main>
  );
}
