export enum CoinType {
  WarmCoin = '1',
  CareCoin = '0',
}

export const CoinName = {
  [CoinType.WarmCoin]: '服装币',
  [CoinType.CareCoin]: '日用币',
}

export const CoinColor = {
  [CoinType.WarmCoin]: 'rgba(252, 116, 148, 1)',
  [CoinType.CareCoin]: 'rgba(116, 192, 252, 1)',
}
