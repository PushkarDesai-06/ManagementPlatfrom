export type formDataInterface = {
  email: string;
  password: string;
};

export type NavBarProps = {
  activeHref: string;
};

export type ProfileCardProps = {
  handleEditClick: (e: React.MouseEvent) => void;
};
