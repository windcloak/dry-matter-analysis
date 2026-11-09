const resources = [
  {
    name: "PetMD",
    url: "https://www.petmd.com/blogs/nutritionnuggets/cat/jcoates/2013/sept/calculating-carbohydrates-in-your-cats-food-30887",
    description: "How to Calculate the Carbs in Your Cat's Food",
  },
  {
    name: "Dog Food Advisor - Dry Matter Basis",
    url: "https://www.dogfoodadvisor.com/choosing-dog-food/dry-matter-basis/",
    description: "Dry Matter Basis — A Better Way to Compare Dog Food",
  },
  {
    name: "CatFoodDB",
    url: "https://catfooddb.com/",
    description: "Cat food reviews",
  },
  {
    name: "Dog Food Advisor",
    url: "https://www.dogfoodadvisor.com/",
    description: "Dog food reviews",
  },

  {
    name: "Hare Today",
    url: "https://hare-today.com/raw_food_education",
    description: "Raw food resources for cats and dogs",
  },
];

export default function Resources() {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-primary-900">Resources</h2>
      <ul className="mt-4 space-y-4">
        {resources.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-secondary-600 underline hover:text-secondary-700"
            >
              {resource.name}
            </a>
            <p className="text-primary-700">{resource.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
