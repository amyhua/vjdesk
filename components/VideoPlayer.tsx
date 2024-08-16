"use client";
import React, { FC, useRef } from "react";

const VideoPlayer: FC<{ file: string; extension: string; width: number }> = ({
  file,
  extension,
  width
}) => {
  const vidRef = useRef(null);
  const play = () => {
    if (vidRef.current) (vidRef.current as HTMLVideoElement).play();
  };
  const pause = () => {
    if (vidRef.current) (vidRef.current as HTMLVideoElement).pause();
  };
  const restart = () => {
    if (vidRef.current) {
      (vidRef.current as HTMLVideoElement).currentTime = 0;
      (vidRef.current as HTMLVideoElement).play();
    }
  };
  return extension.endsWith('mov') ? (
    // .mov video player
    <video
      controls
      autoPlay={false}
      width={width}
      height={Math.round(width * 0.5625)} // 16:9 aspect ratio
      loop
      muted
      ref={vidRef}
      onMouseEnter={play}
      onMouseOut={pause}
      onClick={restart}
    >
      <source src={file} />
    </video>
  ) : (
    <video
      controls
      autoPlay={false}
      width={width}
      height={Math.round(width * 0.5625)} // 16:9 aspect ratio
      loop
      muted
      ref={vidRef}
      onMouseEnter={play}
      onMouseOut={pause}
      onClick={restart}
    >
      <source src={file} type={`video/${extension.endsWith('mov') ? 'mp4' : extension}`} />
    </video>
  )
};

export default VideoPlayer;
