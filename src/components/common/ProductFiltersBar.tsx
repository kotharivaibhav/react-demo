import { PRODUCT_CATEGORIES } from '@/constants';
import { Input, Select } from '@/components/ui';
import { useProductFilters } from '@/hooks';

export const ProductFiltersBar = () => {
  const { search, category, sortBy, sortOrder, setSearch, setCategory, setSortBy, setSortOrder } =
    useProductFilters();

  return (
    <div className="filters-bar">
      <Input
        label="Search"
        name="search"
        placeholder="Search by name, description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as typeof category)}
        options={PRODUCT_CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
      />
      <Select
        label="Sort by"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        options={[
          { value: 'name', label: 'Name' },
          { value: 'price', label: 'Price' },
        ]}
      />
      <Select
        label="Order"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
        options={[
          { value: 'asc', label: 'Ascending' },
          { value: 'desc', label: 'Descending' },
        ]}
      />
    </div>
  );
};
