import ProfileLayout from "Layouts/ProfileLayout"
import Dashboard from "Pages/Dashboard"
import Default from "Pages/Default"
import ManageUsers from "Pages/Admin/ManageUsers.js"
import { scrollToAnchor } from "Utils"
import Icons from "Components/Icons"

const authenticated = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Icons.logo,
    route: "/EXRX/:name/dashboard",
    position: ["auth-nav", "left-aside"],
    group: ["authenticated"],
    children: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      isAnchor && scrollToAnchor(mdl.state.anchor)
    },
    component: (mdl) => m(ProfileLayout, { mdl }, m(Dashboard, { mdl }))
  },
  {
    id: "profile-page",
    title: "Profile Page",
    icon: Icons.home,
    route: "/EXRX/:name/profile",
    position: ["settings-nav"],
    group: ["authenticated"],
    children: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      console.log(
        "profile page login on match",
        mdl,
        args,
        path,
        fullroute,
        isAnchor,
        !mdl.state.isAuth()
      )
      isAnchor && scrollToAnchor(mdl.state.anchor)
    },
    component: (mdl) => m(ProfileLayout, { mdl }, m(Default, { mdl }))
  },
  {
    id: "manage-users",
    title: "Manage Users",
    icon: Icons.users,
    route: "/EXRX/:name/user-management",
    position: ["settings-nav"],
    group: ["authenticated", "admin"],
    children: [],
    onmatch: (mdl, args, path, fullroute, isAnchor) => {
      // console.log(
      //   "manage users on match",
      //   mdl,
      //   args,
      //   path,
      //   fullroute,
      //   isAnchor,
      //   mdl.state.isAuth(),
      //   mdl.user.isAdmin
      // )
      !mdl.user.isAdmin && m.route.set(m.route.get())
      isAnchor && scrollToAnchor(mdl.state.anchor)
    },
    component: (mdl) => m(ProfileLayout, { mdl }, m(ManageUsers, { mdl }))
  }
]

export default authenticated
