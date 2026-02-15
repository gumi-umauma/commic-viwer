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

export function ComicsList({ comics }: Props) {
  const [filterText, setFilterText] = useState("");

  const filteredComics = comics.filter((comic) =>
    comic.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <>
      <div className="mb-4">
        <TitleFilter value={filterText} onChange={setFilterText} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredComics.map((comic) => (
          <Link
            key={comic.id}
            href={`/comic/${comic.id}`}
            className="bg-surface border border-outline rounded overflow-hidden hover:bg-surface-hover transition-colors"
          >
            <img
              src={`/api/comic/${comic.id}/volume/1/page/1`}
              alt={comic.title}
              className="w-full aspect-[2/3] object-cover bg-placeholder"
            />
            <p className="p-2 text-body text-sm font-medium truncate">
              {comic.title}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
