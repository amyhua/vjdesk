# vjdesk

A simple locally run app to curate and rate local video clips and organize curated videos (work in progress). This app is useful for [VJs](https://en.wikipedia.org/wiki/VJing) who need to curate quality videos for their visual content collection in preparation for a show.

**Features**

* Quickly preview your videos all in one place on a website, no matter where they are located in your files and folders.
* Curate your videos by rating your whole collection (good, great, bad).
* Download only your curated good and/or great videos, copying all of them into 1 place in your local file system. (Coming soon)
* Tag your videos with arbitrary categories, letting you copy, filter, or download your video collection by tag(s) and ratings. (Coming soon)


This project is licensed under the terms of the MIT license.

Preview:
<img width="950" alt="Website Preview" src="https://github.com/user-attachments/assets/4f3d6be9-4e8c-4bc8-a6a7-c2e46c84b87b">



## Getting Started

This app assumes you have video files in your `~/Downloads/` folder, searches all contents in Downloads for video files, and then serves them on a local website for you to rate (thumbs up/down/star), organize by rating, and (coming soon) download by thumbs up'd and starred.

This app assumes you have NPM and node installed. See [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

This app is not meant to run on the web, only locally.

### Run the app

Run the database boostrap commands:

```bash
npm run schema:reset
```

Run the local web server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

Right now, it will search for all videos in your Downloads folder and serve it off your `public/` folder for you to load into your local app. Hover on/off  a video to start/stop it. Rate the video. 

## Contribute

This app is built with Typescript, React, TailwindCSS, Prisma, SQLite, and Next.js v14. This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
