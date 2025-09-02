export type formDataInterface = {
  email: string;
  password: string;
};

export type NavBarProps = {
  activeHref: string;
};

export type ProfileCardProps = {
  handleEditClick: (e: React.MouseEvent) => void;
  name: string;
  city: string;
  countryCode: string;
  handle: string;
  description?: string;
  pfpUrl?: string;
};
