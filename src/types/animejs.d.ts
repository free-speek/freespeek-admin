declare module "animejs" {
  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    tick(time: number): void;
    finished: Promise<void>;
  }

  interface AnimeParams {
    targets?: any;
    duration?: number;
    delay?: number | ((el: Element, index: number) => number);
    endDelay?: number | ((el: Element, index: number) => number);
    easing?: string | ((el: Element, index: number) => number);
    round?: number | boolean;
    direction?: "normal" | "reverse" | "alternate";
    loop?: number | boolean;
    autoplay?: boolean;
    update?: (anim: AnimeInstance) => void;
    begin?: (anim: AnimeInstance) => void;
    run?: (anim: AnimeInstance) => void;
    complete?: (anim: AnimeInstance) => void;
    opacity?: number | number[];
    translateX?: number | number[];
    translateY?: number | number[];
    scale?: number | number[];
    rotate?: number | number[];
    [key: string]: any;
  }

  namespace anime {
    function stagger(value: number): (el: Element, index: number) => number;
  }

  function anime(params: AnimeParams): AnimeInstance;
  const anime: {
    (params: AnimeParams): AnimeInstance;
    stagger(value: number): (el: Element, index: number) => number;
  };
  export = anime;
}

declare module "animejs/lib/anime.js" {
  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    tick(time: number): void;
    finished: Promise<void>;
  }

  interface AnimeParams {
    targets?: any;
    duration?: number;
    delay?: number | ((el: Element, index: number) => number);
    endDelay?: number | ((el: Element, index: number) => number);
    easing?: string | ((el: Element, index: number) => number);
    round?: number | boolean;
    direction?: "normal" | "reverse" | "alternate";
    loop?: number | boolean;
    autoplay?: boolean;
    update?: (anim: AnimeInstance) => void;
    begin?: (anim: AnimeInstance) => void;
    run?: (anim: AnimeInstance) => void;
    complete?: (anim: AnimeInstance) => void;
    opacity?: number | number[];
    translateX?: number | number[];
    translateY?: number | number[];
    scale?: number | number[];
    rotate?: number | number[];
    [key: string]: any;
  }

  namespace anime {
    function stagger(value: number): (el: Element, index: number) => number;
  }

  function anime(params: AnimeParams): AnimeInstance;
  const anime: {
    (params: AnimeParams): AnimeInstance;
    stagger(value: number): (el: Element, index: number) => number;
  };
  export = anime;
}
