export const heroPlaygroundClassNames = {
  root: "playground relative mx-auto aspect-square w-full max-w-[23rem] select-none sm:max-w-[27rem]",
  stage: "playground-stage absolute inset-[3%] flex items-center justify-center",
  halo: "playground-halo absolute inset-[8%] rounded-full",
  orbitOuter: "playground-orbit absolute size-[86%] rounded-full border border-accent-vivid/20",
  orbitInner: "playground-orbit-inner absolute size-[62%] rounded-full border border-accent-warm/25",
  axis: "playground-axis absolute h-px w-[92%]",
  orb: "playground-orb absolute size-[52%]",
  core: "playground-core absolute inset-[21%] rounded-full",
  marker: "playground-marker absolute left-1/2 top-[-0.28rem] size-2.5 -translate-x-1/2 rounded-full bg-accent-warm shadow-[0_0_1.5rem_rgb(244_114_182_/_0.8)]",
  label: "absolute bottom-[2%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.2em] text-faint",
} as const;
