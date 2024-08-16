"use client";
import React from "react";
import classNames from "classnames";
import path from "path";
import { Vote, VoteFn, VoteValue } from "@/types";
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
  onVoteCb?: VoteFn;
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
        "flex text-xl mt-4 mb-4 cursor-pointer border border-white/50 rounded-sm text-center"
      )}
    >
      {loading ? (
        <div className="w-full text-center text-sm p-4">Loading...</div>
      ) : (
        <>
          <div
            onClick={() => onVote("up")}
            className={classNames("p-2 flex-1 hover:bg-green-600", {
              "text-white hover:text-white focus:text-white": vote !== "up",
              "border-white text-white bg-green-300/30": vote === "up"
            })}
          >
            👍
          </div>
          <div
            onClick={() => onVote("super")}
            className={classNames("p-2 flex-1 hover:bg-yellow-600/30", {
              "text-white hover:text-white focus:text-white": vote !== "super",
              "border-white text-white bg-yellow-300/30": vote === "super"
            })}
          >
            👍👍
          </div>
          <div
            onClick={() => onVote("down")}
            className={classNames("p-2 flex-1 hover:bg-red-600", {
              "text-white hover:text-white focus:text-white":
                vote !== "down",
              "border-white text-white bg-red-500/30": vote === "down"
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
