"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export type CollectionFilterState = {
  inStockOnly: boolean;
  minPrice: string;
  maxPrice: string;
  color: string;
  size: string;
  sort: "BEST_SELLING" | "PRICE" | "CREATED";
  reverse: boolean;
  viewMode: "grid" | "list";
};

type ProductFiltersProps = {
  value: CollectionFilterState;
  onChange: (value: CollectionFilterState) => void;
  colors?: string[];
  sizes?: string[];
};

export default function ProductFilters({ value, onChange, colors = [], sizes = [] }: ProductFiltersProps) {
  return (
    <aside className="rounded-xl border border-gray-200 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide">Filters</h2>

      <div className="mt-4 space-y-3 text-sm">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={value.inStockOnly}
            onCheckedChange={(checked) => onChange({ ...value, inStockOnly: Boolean(checked) })}
          />
          In stock only
        </label>

        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Min"
            value={value.minPrice}
            onChange={(event) => onChange({ ...value, minPrice: event.target.value })}
          />
          <Input
            placeholder="Max"
            value={value.maxPrice}
            onChange={(event) => onChange({ ...value, maxPrice: event.target.value })}
          />
        </div>

        {colors.length ? (
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">Color</span>
            <select
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
              value={value.color}
              onChange={(event) => onChange({ ...value, color: event.target.value })}
            >
              <option value="">All colors</option>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {sizes.length ? (
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-wide text-gray-500">Size</span>
            <select
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
              value={value.size}
              onChange={(event) => onChange({ ...value, size: event.target.value })}
            >
              <option value="">All sizes</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant={value.sort === "BEST_SELLING" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...value, sort: "BEST_SELLING" })}
          >
            Sort: Best selling
          </Button>
          <Button
            variant={value.sort === "PRICE" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...value, sort: "PRICE" })}
          >
            Sort: Price
          </Button>
          <Button
            variant={value.sort === "CREATED" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...value, sort: "CREATED" })}
          >
            Sort: Newest
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...value, reverse: !value.reverse })}
          >
            Direction: {value.reverse ? "Descending" : "Ascending"}
          </Button>

          <div className="mt-1 grid grid-cols-2 gap-2">
            <Button
              variant={value.viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onChange({ ...value, viewMode: "grid" })}
            >
              Grid
            </Button>
            <Button
              variant={value.viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onChange({ ...value, viewMode: "list" })}
            >
              List
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
