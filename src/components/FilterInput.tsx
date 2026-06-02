interface FilterInputProps {
  filter: string;
  onFilterChange: (value: string) => void;
}

function FilterInput({
  filter,
  onFilterChange,
}: FilterInputProps) {
  return (
    <div className="filter">
      <input
        type="text"
        placeholder="Filter by name or symbol..."
        value={filter}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFilterChange(e.target.value)
        }
      />
    </div>
  );
}

export default FilterInput;