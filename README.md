# Twitter Toplinks App

    Simple Nodejs App to Analyze your last 7 days tweets.

## How it Works

    When user signup using twitter OAuth,
    The app will fetch tweets from twiiter using twitter apis and does some computation on it and saves data to mongodb

## Setup Guide

-   `git clone git@github.com:vithalreddy/twitter-toplinks.git`
-   cd into dir and do `npm i`
-   You can pass MongoDB and Twitter App Env Variable, for all env variable names please refer, `config/index.js` file.
-   for starting app in dev mode run `npm run dev`
-   for starting app in prod mode run `npm start`

## Todos

-   [ ] Pagination in Tweets API
-   [ ] Implementing quequing system for pulling tweets

### Author

**Vithal Reddy**

-   [github/vithalreddy](https://github.com/vithalreddy)
-   [vithalreddy.com](https://vithalreddy.com)
