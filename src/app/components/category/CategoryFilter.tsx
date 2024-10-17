interface Category {
  id: number;  // number, correspondant à l'ID de la catégorie
  name: string;  // nom de la catégorie
}

interface CategoryFilterProps {
  categories: Category[];  // Liste des catégories disponibles
  onFilterChange: (categoryId: number) => void;  // Fonction appelée lors du changement de filtre
}

export default function CategoryFilter({ categories, onFilterChange }: CategoryFilterProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryId = Number(e.target.value);
    onFilterChange(selectedCategoryId);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Filtrer par catégorie</label>
      <select
        onChange={handleCategoryChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value={0}>Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
