import dynamic from "next/dynamic";

export const casinoGameComponents = {
  "Color Game": dynamic(() => import("./casino-games/ColorGame")),
  "SD Lotto": dynamic(() => import("./casino-games/SDLotto")),
  "3k Lotre": dynamic(() => import("./casino-games/3kLotre")),
};

export const funGameComponents = {
  "ROCK PAPER SCISSOR": dynamic(() => import("./fun-games/RockPaperScissor")),
  "VALENTINE": dynamic(() => import("./fun-games/Valentine")),
  " LANKESH": dynamic(() => import("./fun-games/Lankesh")),
  "VR BOLLYWOOD KISS": dynamic(() => import("./fun-games/VrBollywoodKiss")),
};

export const allGameComponents = {
  ...casinoGameComponents,
  ...funGameComponents,
};

export const gameThumbnails = {
  "Color Game": "/images/cv.png",
  "SD Lotto": "/images/harsh.png",
  "3k Lotre": "/images/3k_lotre.png",
  "ROCK PAPER SCISSOR": "/images/default_game.png",
  "VALENTINE": "/images/default_game.png",
  " LANKESH": "/images/default_game.png",
  "VR BOLLYWOOD KISS": "/images/default_game.png",
};