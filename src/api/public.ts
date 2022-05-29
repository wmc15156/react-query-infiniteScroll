import axiosClient from './index';

export interface IUserInfo {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

type IReqUserInfo = Omit<IUserInfo, 'id'>;

export function getUsers() {
  return axiosClient.get<IUserInfo[]>('/public/v2/users').then((resp) => resp.data);
}

export function addUser(body: IReqUserInfo) {
  return axiosClient.post(`/public/v2/users`, body).then((resp) => resp.data);
}
