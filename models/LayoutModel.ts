import Footer from "./FooterModel";
import Menu from "./Menu";

export default interface LayoutModel {
    menus: Menu[];
    footer: Footer;
}