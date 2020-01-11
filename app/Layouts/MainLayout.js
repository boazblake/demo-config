import Header from "Components/Headers/Header"
import Footer from "Components/Footer"
import Body from "Components/Body"
import LeftAside from "Components/LeftAside"
import RightAside from "Components/RightAside"

const MainLayout = ({ attrs: { mdl } }) => {
  const showMenu = () => mdl.state.showNav() || mdl.state.profile == "desktop"

  return {
    view: ({ children }) =>
      m(
        ".mainLayout",
        {
          id: "mainLayout"
        },
        [
          m(Header, { mdl }),
          showMenu() && m(LeftAside, { mdl }),
          m(Body, { mdl }, [children]),
          m(RightAside, { mdl }),
          m(Footer, { mdl })
        ]
      )
  }
}

export default MainLayout
