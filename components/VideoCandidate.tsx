'use client';
import React, { FC } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoVote from "./VideoVote";
import { CategoryDatum, Vote } from "@/types";
import CategoriesAutocomplete from "./CategoriesAutocomplete";

const WIDTH = 800;

const dirPathSegments = (process.env.DOWNLOADS_DIR ?? "").split("/");
const getExtension = (file: string) => file.split(".").pop() ?? "";

// const getVote = async (file: string) => {
//   const apiUrl = path.join(process.env.API_URL ?? "http://localhost:3001", 'votes');
//   const url = `${apiUrl}?file=${encodeURIComponent(file)}`;
//   try {
//     const resp = await fetch(url);
//     if (resp.status !== 200) return '';
//     const data = await resp.json();
//     const { id, vote } = data;
//     if (vote === "up" || vote === "down") return { id, vote };
//     return { id: "", vote: "" };
//   }
//   catch (e) {
//     return { id: "", vote: "" };
//   }
// }

const getCategories = async (): Promise<CategoryDatum[]> => {
  const resp = await fetch(`http://localhost:3001/categories`);
  if (resp.status !== 200) return [];
  const data = await resp.json();
  return data.map((d: CategoryDatum) => ({ id: d.id, name: d.name }));
};

const VideoCandidate: FC<{
  file: string;
  fileCategories?: string[];
  initialVote?: Vote;
  onVoteCb?: (val: "up" | "down" | "") => void;
}> = ({ file, initialVote, onVoteCb, fileCategories = [] }) => {
  const path = file.split("/").slice(dirPathSegments.length).join("/");
  const filename = file.split("/")[file.split("/").length - 1];
  return (
    <div tabIndex={0} className="px-3 py-5 m-1 border border-transparent flex items-center justify-center flex-col">
      <VideoPlayer width={WIDTH} file={file} extension={getExtension(file)} />
      <VideoVote initialVote={initialVote} width={WIDTH} file={file} onVoteCb={onVoteCb} />
      <CategoriesAutocomplete fileCategories={fileCategories} file={file} />
      <div className="font-bold mb-0.5">{filename}</div>
      <div className="font-light text-sm mb-1 text-white/70">{path}</div>
    </div>
  );
};

export default VideoCandidate;
