<div align="center">

# Acuity Kinetic

### A coach in your pocket. Real feedback, in real time.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-r184-000000?logo=threedotjs&logoColor=white)

Point your camera, pick a sport, and get a short spoken cue on your form, in real time.

</div>

> Acuity Kinetic watches how you move and tells you what to fix while you are still moving, the way a coach calls out a correction from the sideline.

---

## Contents

1. [What it is](#what-it-is)
2. [What it does](#what-it-does)
3. [How a cue is made](#how-a-cue-is-made)
4. [Tech stack](#tech-stack)
5. [Running it locally](#running-it-locally)
6. [Environment variables](#environment-variables)
7. [Project structure](#project-structure)
8. [Deploying](#deploying)

<details>
<summary>About this project</summary>

This is a polished demo, built to feel like a real product rather than a prototype. The whole thing runs in the browser: the camera feed never leaves your device until a single frame is sent off for analysis, and the pose tracking that frames you up happens locally. It is meant to be quick to read and quick to try.

</details>

---

## What it is

Acuity Kinetic is a web demo of a real-time AI sports coaching tool. It watches you through your camera, reads your body position, and speaks one short coaching cue at a time. The idea is simple: get the kind of feedback a coach would give you mid-set, without anyone standing there.

[Back to top](#contents)

---

## What it does

- A short loading intro ("For athletes, by an athlete") with a progress bar that fades into the site.
- A hero with a 3D scene that cross-fades through a dribbling basketball, a tennis racket and ball, and a golf putter and ball.
- A live demo that uses your webcam:
  - On-device pose detection draws a skeleton overlay and tells you whether you are too close, too far, or well framed.
  - Every 2.5 seconds it sends a frame to a vision model and shows the cue it gets back.
  - Cues appear newest first, repeats are filtered out, and each one is read aloud (with a mute toggle and a small chime when it arrives).
  - When no one is in frame, it skips the call to save quota.
- A waitlist that records real signups to a Google Sheet.

[Back to top](#contents)

---

## How a cue is made

The same loop runs a few times a minute while you train. Each pass takes one frame from your camera to a spoken cue.

1. Capture a frame from the live camera and scale it down to a small JPEG.
2. Check framing with a local pose model. If no athlete is found, the frame is dropped before anything is sent.
3. Send the frame to a vision model with instructions written for the sport you picked, asking for the single most important correction.
4. Get back one short cue, fifteen words or fewer. Identical back-to-back cues are discarded.
5. Show the cue at the top of the feed with a timestamp and read it aloud, unless you have muted it.

If a request fails or times out, a brief notice appears and the loop retries on its own.

[Back to top](#contents)

---

## Tech stack

- React 18 and Vite
- Tailwind CSS for styling
- Framer Motion for animation
- three.js with react-three-fiber and drei for the 3D scene
- MediaPipe Tasks Vision for in-browser pose detection
- A vision model for the coaching cues
- Web Speech API for the voice, Web Audio for the chime

[Back to top](#contents)

---

## Running it locally

You need Node 18 or newer.

```bash
# 1. install dependencies
npm install

# 2. add your keys
cp .env.example .env
#    then open .env and fill it in (see the next section)

# 3. start the dev server
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in Chrome, allow camera access, choose a sport, and start coaching. The camera and speech features need a secure context, and `localhost` counts as secure, so local development works out of the box.

[Back to top](#contents)

---

## Environment variables

Everything lives in `.env`. Copy `.env.example` to get started.

| Variable | Required | What it is |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | yes | The API key for the vision model that writes the cues. See `.env.example` for where to get one free. |
| `VITE_COACH_MODEL` | no | Override the model id. Defaults to a fast, low-latency model that suits a frame every couple of seconds. |
| `VITE_WAITLIST_URL` | no | A Google Apps Script web app URL for the waitlist. It must end in `/exec`. Without it, the form still works in the UI but does not record anything. |

[Back to top](#contents)

---

## Project structure

<details>
<summary>Show the file tree</summary>

```
.
├── index.html
├── tailwind.config.js          # design tokens (colors, fonts, radii)
├── postcss.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx                 # layout, shared sport state, toasts
    ├── components/
    │   ├── LoadingScreen.jsx   # the intro overlay
    │   ├── Hero.jsx            # headline, calls to action, the 3D scene
    │   ├── SportsScene.jsx     # procedural three.js models and animation
    │   ├── Capabilities.jsx    # the scroll-revealed feature section
    │   ├── Demo.jsx            # camera, capture loop, model calls
    │   ├── CameraFeed.jsx      # webcam, pose overlay, distance, REC dot
    │   ├── FeedbackPanel.jsx   # the cue feed, mute, clear
    │   ├── Pipeline.jsx        # the step-by-step section
    │   ├── Waitlist.jsx
    │   ├── Footer.jsx
    │   └── Toast.jsx
    └── utils/
        ├── captureFrame.js         # video frame to a small base64 JPEG
        ├── speechOutput.js         # Web Speech wrapper
        ├── soundFx.js              # the arrival chime
        ├── poseDetector.js         # MediaPipe pose and distance estimate
        ├── proceduralTextures.js   # canvas textures for the 3D models
        ├── coachApi.js             # the vision model call
        └── waitlist.js             # the Google Sheet signup
```

</details>

[Back to top](#contents)

---

## Deploying

Two things to know before putting this on the public web:

- The app calls the model directly from the browser using your key, so the key ends up in the client bundle. That is fine for a local or private demo, but not for a public site. For production, move the call behind a small serverless function that holds the key and point the client at it.
- The camera and speech features need HTTPS in production. `localhost` is treated as secure during development, but a deployed site has to be served over HTTPS.

[Back to top](#contents)

---

<div align="center">

© 2026 Acuity Kinetic

</div>
