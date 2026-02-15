"use client";

import { useState } from "react";
import Link from "next/link";
import { TitleFilter } from "@/app/components/title-filter";

type Comic = {
  id: string;
  title: string;
};

type Props = {
  comics: Comic[];
};

export function AdminComicsList({ comics }: Props) {
  const [filterText, setFilterText] = useState("");

  const filteredComics = comics.filter((comic) =>
    comic.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <div className="mb-4">
        <TitleFilter value={filterText} onChange={setFilterText} />
      </div>
      <ul className="space-y-2">
        {filteredComics.map((comic) => (
          <li key={comic.id}>
            <Link
              href={`/admin/comic/${comic.id}`}
              className="block p-4 bg-surface border border-outline rounded hover:bg-surface-hover transition-colors"
            >
              {comic.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
