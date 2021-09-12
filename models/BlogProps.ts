import Blog from "./Blog";
import Menu from "./Menu";
import FooterModel from "./FooterModel";

export default interface BlogProps {
	menu: Menu[];
	blog: Blog;
	footer: FooterModel;
}
