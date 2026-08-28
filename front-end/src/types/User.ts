export interface UserInterface {
  id: String;
  name: String;
  email: String;
  cep: String;
  admin: boolean;
}

export type UserContextType = {
  user: UserInterface | null;
  setUser: React.Dispatch<React.SetStateAction<null>>;
};
