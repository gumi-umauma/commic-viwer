"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TitleFilter({ value, onChange }: Props) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="タイトルで絞り込み"
      className="bg-surface border border-outline rounded px-3 py-2 w-64 focus:border-outline-focus focus:outline-none text-body text-sm"
    />
  );
}
