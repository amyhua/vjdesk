import React, { FC, PropsWithChildren } from "react";
import VideoOrganizer from "@/components/VideoOrganizer";
import getDownloadedFiles from "./actions/getDownloadedFiles";
import { ClipDatum, ClipRecord } from "@/types";
import getDownloadedFiles3 from "./actions/getDownloadedFiles";
import { fetchJson } from "@/modules/fetch";
import { clipsApiUrl } from "@/modules/config";

const loadFiles = async (): Promise<{
  loadedFiles: {
    file: string;
    data?: ClipDatum;
  }[],
  ups: number,
  downs: number,
  supers: number,
}> => {
  // TODO: FIX MOV FILES
  const rows = await fetchJson('GET', clipsApiUrl) as ClipRecord[];
  if (!rows) return {
    loadedFiles: [],
    ups: 0,
    downs: 0,
    supers: 0,
  };
  const files = await getDownloadedFiles3(rows
    .filter(d => d.vote === 'up' || d.vote === 'super')
    .map(d => decodeURIComponent(d.file)));
  const voteset: Map<string, ClipRecord> = new Map((rows as ClipRecord[]).map(d => [d.file, d]));
  let ups = 0;
  let downs = 0;
  let supers = 0;
  const filesWithVotesCats = files.filter(Boolean).map((file: string) => {
    const record = voteset.get(encodeURIComponent(file));
    if (record) {
      if (record.vote === 'super') {
        supers++;
      } else if (record.vote === 'up') {
        ups++;
      } else if (record.vote === 'down') {
        downs++;
      }
    }
    const data: ClipDatum = record ? {
      ...record,
      categories: record.categories ? record.categories.split("|") : []
    } as ClipDatum : {
      id: '',
      vote: '',
      file,
      categories: []
    };
    return { file, data };
  });

  return {
    loadedFiles: filesWithVotesCats,
    ups,
    downs,
    supers
  };
}

const Home: FC<PropsWithChildren> = async () => {
  const data = await loadFiles();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-white">
      <VideoOrganizer data={data} />
    </main>
  );
}

export default Home;
