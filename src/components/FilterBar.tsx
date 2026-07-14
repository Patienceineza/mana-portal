import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface SelectFilter {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  selects?: SelectFilter[];
}

const SEARCH_DEBOUNCE_MS = 300;

// Search input debounces internally so every page using this doesn't have
// to re-implement it — pages just hold the committed value and a setter.
export function FilterBar({ search, selects }: FilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search?.value ?? '');

  useEffect(() => {
    setLocalSearch(search?.value ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.value]);

  useEffect(() => {
    if (!search) return;
    const handle = setTimeout(() => search.onChange(localSearch), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  if (!search && !selects?.length) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {search && (
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={search.placeholder ?? 'Search...'}
            className="pl-9"
          />
        </div>
      )}
      {selects?.map((s) => (
        <Select key={s.placeholder} value={s.value} onChange={(e) => s.onChange(e.target.value)} className="w-auto min-w-[160px]">
          <option value="">{s.placeholder}</option>
          {s.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ))}
    </div>
  );
}
