// exportando interface de promise(promessa)
export interface usersOwners {
  id: string;
  email: string;
}

// exportando interface a ser implementada
export interface IFindUserOwnersRepositories {
  findUserOwners(): Promise<usersOwners[]>;
}
