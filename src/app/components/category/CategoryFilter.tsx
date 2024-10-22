interface CategoryFilterProps {
  categories: { id: number; name: string }[]; // Liste des catégories avec id et nom
  onFilterChange: (categoryName: string | null) => void; // Fonction de callback pour filtrer par nom de catégorie
}

export default function CategoryFilter({
  categories,
  onFilterChange,
}: CategoryFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-white">
        Filtrer par catégorie
      </label>
      <select
        onChange={(e) => onFilterChange(e.target.value || null)} // Appeler la fonction avec le nom de la catégorie ou null si "toutes les catégories" est sélectionnée
        className="border rounded px-4 py-2 text-gray-700"
      >
        <option value="">Toutes les catégories</option>{" "}
        {/* Option pour ne filtrer par aucune catégorie */}
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {" "}
            {/* Utiliser le nom de la catégorie dans la valeur */}
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
