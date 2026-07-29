import { LuUser, LuWrench, LuLibraryBig, LuNewspaper } from "react-icons/lu";

export const sidebar = {
  userName: `Nikolaos Stathoulopoulos`,
  profileImage: `/webpage/images/Nikolaos_Stathoulopoulos_zoomed.jpg`,
  sections: [
    {
      title: `About Me`,
      url: ``,
      icon: LuUser
    },
    {
      title: `Projects`,
      url: `projects`,
      icon: LuWrench
    },
    {
      title: `Publications`,
      url: `publications`,
      icon: LuLibraryBig
    },
    {
      title: `Presentations`,
      url: `articles`,
      icon: LuNewspaper
    }
  ]
};