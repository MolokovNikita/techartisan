import Body from "../components/Body";

function MainPage(props) {
  const { setIsServiceModalOpen, setIsOpen, setIsOrderCallPopUpOpen } = props;
  return (
    <>
      <Body
        setIsServiceModalOpen={setIsServiceModalOpen}
        setIsOpen={setIsOpen}
        setIsOrderCallPopUpOpen={setIsOrderCallPopUpOpen}
      />
    </>
  );
}

export default MainPage;
