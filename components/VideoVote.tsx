"use client";
import React from "react";
import classNames from "classnames";
import path from "path";
import { Vote, VoteValue } from "@/types";
import { clipsApiUrl } from "@/modules/config";
import { fetchJson } from "@/modules/fetch";

const VideoVote = ({
  file,
  width,
  initialVote,
  onVoteCb
}: {
  file: string;
  width: number;
  initialVote?: Vote;
  onVoteCb?: (val: VoteValue) => void;
}) => {
  const [vote, setVote] = React.useState(initialVote?.vote);
  const [loading, setLoading] = React.useState(false);
  const onVote = async (voteVal: VoteValue) => {
    // Send vote to server
    setLoading(true);
    await fetchJson("POST", clipsApiUrl, {
      body: JSON.stringify({ file: encodeURIComponent(file), vote: voteVal, id: initialVote?.id ?? '' })
    });
    if (onVoteCb) onVoteCb(voteVal);
    setVote(voteVal);
    setLoading(false);
  };
  return (
    <div
      style={{
        width: width
      }}
      className={classNames(
        "flex text-xl mt-4 mb-4 cursor-pointer border border-white/20 rounded-sm text-center"
      )}
    >
      {loading ? (
        <div className="w-full text-center text-sm p-4">Loading...</div>
      ) : (
        <>
          <div
            onClick={() => onVote("up")}
            className={classNames("p-2 flex-1 hover:bg-blue-600", {
              "text-white/30 hover:text-white focus:text-white": vote !== "up",
              "border-white text-white bg-blue-500": vote === "up"
            })}
          >
            👍
          </div>
          <div
            onClick={() => onVote("super")}
            className={classNames("p-2 flex-1 hover:bg-blue-600", {
              "text-white/30 hover:text-white focus:text-white": vote !== "super",
              "border-white text-white bg-yellow-500": vote === "super"
            })}
          >
            👍👍
          </div>
          <div
            onClick={() => onVote("down")}
            className={classNames("p-2 flex-1 hover:bg-red-600", {
              "text-white/30 hover:text-white focus:text-white":
                vote !== "down",
              "border-white text-white bg-red-500": vote === "down"
            })}
          >
            👎
          </div>
        </>
      )}
    </div>
  );
};

export default VideoVote;
