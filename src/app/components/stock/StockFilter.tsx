interface StockFilterProps {
  onFilterChange: (inStock: boolean | null) => void;  // Fonction appelée lors du changement de filtre
}

export default function StockFilter({ onFilterChange }: StockFilterProps) {
  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      onFilterChange(null);  // null signifie "tous les produits"
    } else {
      onFilterChange(value === 'true');  // true pour en stock, false pour rupture
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Filtrer par disponibilité</label>
      <select
        onChange={handleStockChange}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="all">Tous les produits</option>
        <option value="true">En stock</option>
        <option value="false">Rupture de stock</option>
      </select>
    </div>
  );
}
