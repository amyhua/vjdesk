const fs = require("fs/promises");
const { existsSync } = require("fs");
const path = require("path");
const videoExtensions = require("video-extensions");

// convert
/*
const isVideoFile = (file: string) => {
  const ext = file.split(".").pop();
  return videoExtensions.includes(ext ?? "");
};

const walkDir = async (
  dir: string,
  fileList: string[] = [],
  processFile?: (file: string) => Promise<void>
) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const path = `${dir}/${file}`;
    const stat = await fs.stat(path);
    if (stat.isDirectory()) {
      await walkDir(path, fileList, processFile);
    } else {
      fileList.push(path);
      if (processFile) await processFile(path);
    }
  }
  return fileList;
};

const getDownloadedFiles = async () => {
  if (!process.env.DOWNLOADS_DIR) throw new Error("DOWNLOADS_DIR not set");
  const files = await walkDir(process.env.DOWNLOADS_DIR, []);
  const promises = files.filter(isVideoFile).map(async (file) => {
    if (!file.endsWith('.mov')) return;
    const filename = file.split("/").slice(-1)[0];
    let publicPath = path.join(
      "videos",
      "movs",
      filename
    );
    // if file is not in /public/videos/noves/* at file path, copy it so it is
    const exists = existsSync(path.join(process.cwd(), "public", publicPath));
    if (!exists) {
      await fs.mkdir(
        path.join(
          process.cwd(),
          "public",
          publicPath.split("/").slice(0, -1).join("/")
        ),
        { recursive: true }
      );
      await fs.copyFile(file, path.join(process.cwd(), "public", publicPath));
    }
    // if (publicPath.endsWith(".mov")) {
    //   // convert .mov to .mp4 using ffmpeg
    //   const newPublicPath = publicPath.replace(".mov", ".mp4");
    //   if (!existsSync(path.join(process.cwd(), "public", newPublicPath))) {
    //     await new Promise((resolve, reject) => {
    //       FfmpegCommand(file)
    //         .outputOptions(["-c:v libx264", "-crf 20", "-preset veryfast"])
    //         .on("end", resolve)
    //         .on("error", reject)
    //         .save(path.join(process.cwd(), "public", newPublicPath));
    //     });
    //   }
    //   publicPath = newPublicPath;
    // }

    return publicPath;
  });
  return Promise.all(promises);
};

export default getDownloadedFiles;

*/

// into .cjs file javascript

const isVideoFile = (file) => {
  const ext = file.split(".").pop();
  return videoExtensions.includes(ext ?? "");
}

const walkDir = async (
  dir,
  fileList = [],
  processFile
) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const path = `${dir}/${file}`;
    const stat = await fs.stat(path);
    if (stat.isDirectory()) {
      await walkDir(path, fileList, processFile);
    } else {
      fileList.push(path);
      if (processFile) await processFile(path);
    }
  }
  return fileList;
}

const getDownloadedFiles = async () => {
  if (!process.env.DOWNLOADS_DIR) throw new Error("DOWNLOADS_DIR not set");
  const files = await walkDir(process.env.DOWNLOADS_DIR, []);
  const promises = files.filter(isVideoFile).map(async (file) => {
    if (!file.endsWith('.mov')) return;
    const filename = file.split("/").slice(-1)[0];
    let publicPath = path.join(
      "videos",
      "movs",
      filename
    );
    const exists = existsSync(path.join(process.cwd(), "public", publicPath));
    if (!exists) {
      await fs.mkdir(
        path.join(
          process.cwd(),
          "public",
          publicPath.split("/").slice(0, -1).join("/")
        ),
        { recursive: true }
      );
      await fs.copyFile(file, path.join(process.cwd(), "public", publicPath));
    }
    return publicPath;
  });
  return Promise.all(promises);
}

module.exports = getDownloadedFiles;
