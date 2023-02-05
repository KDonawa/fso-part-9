interface Props {
  name: string;
}

function Header({ name }: Props) {
  return <h1>{name}</h1>;
}

export default Header;
