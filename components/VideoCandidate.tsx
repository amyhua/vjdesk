'use client';
import React, { FC, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoVote from "./VideoVote";
import { CategoryDatum, Vote, VoteFn } from "@/types";
import CategoriesAutocomplete from "./CategoriesAutocomplete";

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

const INITIAL_WIDTH = 800;
const VID_PADDING = 150;

const VideoCandidate: FC<{
  file: string;
  fileCategories?: string[];
  initialVote?: Vote;
  onVoteCb?: VoteFn;
}> = ({ file, initialVote, onVoteCb, fileCategories = [] }) => {
  const [videoWidth, setVideoWidth] = React.useState(INITIAL_WIDTH);
  const path = file.split("/").slice(dirPathSegments.length).join("/");
  const filename = file.split("/")[file.split("/").length - 1];

  useEffect(() => {
    const resize = () => {
      const width = window.innerWidth - 100;
      setVideoWidth(width > 800 ? 800 : width);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div tabIndex={0} className="px-3 py-5 m-1 border border-transparent flex items-center justify-center flex-col">
      <VideoPlayer width={videoWidth} file={file} extension={getExtension(file)} />
      <VideoVote initialVote={initialVote} width={videoWidth - VID_PADDING} file={file} onVoteCb={onVoteCb} />
      <CategoriesAutocomplete fileCategories={fileCategories} file={file} />
      <div className="font-bold mb-0.5">{filename}</div>
      <div className="font-light text-sm mb-1 text-white/70">{path}</div>
    </div>
  );
};

export default VideoCandidate;
