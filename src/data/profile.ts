import { FaGoogleScholar, FaGithub, FaLinkedin, FaRegIdBadge } from "react-icons/fa6";
import { SiOrcid } from "react-icons/si";

export const profile = {
  name: `Nikolaos Stathoulopoulos`,
  headline: `Ph.D. candidate @ Luleå University of Technology, Sweden`,
  email: `niksta@ltu.se / nstathou@gmail.com`,
  location: `Gothenburg, Västra Götaland, Sweden`,
  profileImage: `/webpage/images/Nikolaos_Stathoulopoulos.jpg`,
  links: [
    {
      name: `Google Scholar`,
      url: `https://scholar.google.com/citations?user=a_aBwmMAAAAJ`,
      icon: FaGoogleScholar
    },
    {
      name: `Github`,
      url: `https://github.com/nstathou`,
      icon: FaGithub
    },
    {
      name: `ORCID`,
      url: `https://orcid.org/0000-0002-0108-6286`,
      icon: SiOrcid
    },
    {
      name: `LinkedIn`,
      url: `https://www.linkedin.com/in/nikos-stathoulopoulos/`,
      icon: FaLinkedin
    },
    {
      name: `CV`,
      url: `/webpage/pdf/cv.pdf`,
      icon: FaRegIdBadge
    }
  ],
  biography: `Hi! I'm Nikolaos (<strong>Nikos</strong> for short) Stathoulopoulos and I am a <strong>Ph.D. 
candidate</strong> in the <a href="https://fieldrobotics.eu" target="_blank" rel="noopener noreferrer"><strong>Robotics & AI (RAI) Group</strong></a>, at 
<strong>Luleå University of Technology, Sweden</strong>. I am working at the 
intersection of <strong>localization, mapping,</strong> and <strong>3D perception.</strong> 
My research centers on multi-robot/multi-session SLAM and long-term map management, combining classical
 and learning-based methods to build adaptive, efficient and reliable perception systems. Core topics include 
 place recognition, loop closures, and back-end optimization for robust lifelong operation.<br/><br/>

I hold a Bachelor's with an integrated Master in Electrical and Computer Engineering from the <a href="https://www.ece.upatras.gr/index.php/en/" target="_blank" rel="noopener noreferrer"><strong>University of Patras, Greece</strong></a>.
During my current position as a Ph.D. student
 I also serve as a Teaching Assistant for Advanced Robotics and Computer Vision & Image Processing.
  I’m active in the <strong>IEEE Robotics & Automation Society (RAS)</strong> and the broader robotics community, 
  with publications in <strong>ICRA, IROS, RA-L and T-FR</strong>. I’m always open to collaboration, code sharing, 
  and brainstorming, feel free to <a href="mailto:niksta@ltu.se" target="_blank" rel="noopener noreferrer">reach me</a>.`
};