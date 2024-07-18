import Body from "../components/Body";

function MainPage(props) {
  const { setIsServiceModalOpen, setIsOpen } = props;
  return (
    <>
      <Body
        setIsServiceModalOpen={setIsServiceModalOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}

export default MainPage;
