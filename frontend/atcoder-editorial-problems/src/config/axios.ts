import axios from 'axios';

export const axiosInstance = axios.create({
  // TODO:APIエンドポイントを設定
  baseURL: 'baseURL',
});
