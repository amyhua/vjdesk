'use client';

import React, { FC, useCallback, useEffect, useState } from "react";
import VideoCandidate from "./VideoCandidate";
import { CategoryDatum, ClipDatum, VoteValue } from "@/types";
import { categoriesApiUrl, clipsApiUrl } from "@/modules/config";
import { fetchJson } from "@/modules/fetch";
import Categories from "@/contexts/CategoriesContext";
import { ViewColumnsIcon } from "@heroicons/react/20/solid";
import getDownloadedFiles3 from "@/app/actions/getDownloadedFiles";

const VideoOrganizer: FC<{
  data: {
    loadedFiles: {
      file: string;
      data?: ClipDatum;
    }[],
    ups: number,
    downs: number,
    supers: number,
  }
}> = ({ data }) => {
  const [loadedFiles, setLoadedFiles] = useState<{ file: string, data?: ClipDatum }[]>(data.loadedFiles);
  const [filteredVoteValues, setFilteredVoteValues] = useState<VoteValue>('');
  const [ups, setUps] = useState(data.ups);
  const [downs, setDowns] = useState(data.downs);
  const [supers, setSupers] = useState(data.supers);
  const [categories, setCategories] = useState<CategoryDatum[]>([]);
  const [numCols, setNumCols] = useState(3);

  const fetchCategories = useCallback(async () => {
    const data = (await fetchJson("GET", categoriesApiUrl)) as CategoryDatum[];
    setCategories(data.map((d: CategoryDatum) => ({ id: d.id, name: d.name })));
    return data;
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Categories.Provider value={{ categories, setCategories }}>
    <div>
      <h1 className="sticky top-0 py-4 border-b border-b-white/20 bg-black font-bold text-xl mb-4">
        <span className="mr-4"><span onClick={() => setFilteredVoteValues('up')} className="mr-2">{ups}</span> 👍</span>
        <span className="mr-4"><span onClick={() => setFilteredVoteValues('super')} className="mr-2">{supers}</span> 👍👍</span>
        <span className="mr-4"><span onClick={() => setFilteredVoteValues('down')} className="mr-2">{downs}</span> 👎</span>
        / <span onClick={() => setFilteredVoteValues('')}>
        {loadedFiles.length} files ({loadedFiles.length - (ups + supers + downs)} remaining)
        </span>
        <span className="mx-5">
          <ViewColumnsIcon className="inline-block w-6 h-6" onClick={() => setNumCols(numCols === 3 ? 2 : 3)} />
        </span>
      </h1>
      <div className="grid grid-cols-2">
        {loadedFiles.map(({file, data}) => (
          <VideoCandidate key={file} file={file} initialVote={data && {
            id: data.id,
            vote: data.vote
          }} fileCategories={data?.categories ?? []} />
        ))}
      </div>
    </div>
    </Categories.Provider>
  );
};

export default VideoOrganizer;
