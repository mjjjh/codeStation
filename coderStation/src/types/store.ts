import { IUserInfo } from "./api";

type PartialSome<I, T> = Pick<I, T extends keyof I ? T : never> & Partial<Omit<I, T extends keyof I ? T : never>>;
export interface IUserInfoNew {
    userid: string;
    newInfo: {
        [K in keyof IUserInfo]?: IUserInfo[K];
    }
}

type Pretty<T> = {
    [K in keyof T]: T[K];
};
