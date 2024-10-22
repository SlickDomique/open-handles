export enum DomainType {
  CLOUDFLARE = "cloudflare",
  FILE = "file",
}

export const domains: { [domain: string]: DomainType } = {
  "the-gay.cat": DomainType.FILE,
  "woke.cat": DomainType.FILE,
  "lesbian.cat": DomainType.FILE,
  "is-extremely.gay": DomainType.FILE,
  "solo-game.dev": DomainType.FILE,
  "garage-game.dev": DomainType.FILE,
};
