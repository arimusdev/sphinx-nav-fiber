import styled from "styled-components";
import { SearchBar } from "~/components/SearchBar";
import { useAppStore } from "~/stores/useAppStore";

const Header = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100% - 40px);
  pointer-events: none;
  transition: opacity 1s;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 600;
`;

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  border: 1px solid #000;
  background: #f1f1f1;
  border-radius: 40px;
  min-width: 100px;
  margin-left: 20px;
  text-decoration: none;
  color: black;
`;

export const AppBar = () => {
  const sidebarIsOpen = useAppStore((s) => s.sidebarIsOpen);

  if (sidebarIsOpen) {
    return null;
  }

  return (
    <Header>
      <Title style={{ fontWeight: 300, width: 260 }}>
        <b>Second</b>Brain
      </Title>

      <div style={{ width: "40%" }}>
        <SearchBar />
      </div>

      <div style={{ display: "flex", width: 330 }}>
        <Button href="https://sphinx.chat/" target="_blank" rel="noreferrer">
          Info
        </Button>

        <Button href="https://sphinx.chat/" target="_blank" rel="noreferrer">
          Contribute
        </Button>
      </div>
    </Header>
  );
};
