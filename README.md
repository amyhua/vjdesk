# vjdesk

A simple locally run app to curate and rate local video clips and organize curated videos (work in progress).

This project is licensed under the terms of the MIT license.


## Getting Started

This app assumes you have video files in your `~/Downloads/` folder, searches all contents in Downloads for video files, and then serves them on a local website for you to rate (thumbs up/down/star), organize by rating, and (coming soon) download by thumbs up'd and starred.

This app assumes you have NPM, node, and a local Postgresql server (`brew install postgres` on Mac) running.

This app is not meant to run on the web, only locally.

### Run the app

Run the local web server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

Right now, it will search for all videos in your Downloads folder and serve it off your `public/` folder for you to load into your local app. Hover on/off  a video to start/stop it. Rate the video. 

## Contribute

This app uses Typescript, React, and Next.js v14. This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
