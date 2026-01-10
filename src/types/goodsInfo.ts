export enum CoinType {
  WarmCoin = "0",
  CareCoin = "1",
}

export const CoinName = {
  [CoinType.WarmCoin]: "服装币",
  [CoinType.CareCoin]: "日用币",
};

export const CoinColor = {
  [CoinType.WarmCoin]: "#deabfaab",
  [CoinType.CareCoin]: "#4c8cf4aa",
};
