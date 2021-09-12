import About from "../models/About";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import Footer from "../models/FooterModel";
import Menu from "../models/Menu";
import PageIntro from "../models/PageIntro";
import Topic from "../models/Topic";

export default interface IApiHelper {
	getTopics(): Promise<Topic[]>;
	getBanner(): Promise<Banner>;
	getAboutContent(): Promise<About>;
	getMainMenuItems(): Promise<Menu[]>;
	getBlogs(collectionName: string): Promise<Blog[]>;
	getBlogById(id: string): Promise<Blog>;
	getPageIntro(pageName: string): Promise<PageIntro>;
	getFooter(): Promise<Footer>;
}
