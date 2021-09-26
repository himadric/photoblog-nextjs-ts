import "reflect-metadata";
import HomeProps from "../models/HomeProps";
import BlogListProps from "../models/BlogListPorps";
import BlogProps from "../models/BlogProps";
import PageComponentService from "../services/PageComponentService";
import PageLayoutService from "../services/PageLayoutService";
import { container } from "tsyringe";
import { GetStaticPropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import AboutPorps from "../models/AboutProps";
import ApiHelper from "./ContentHubApiHelper";

container.register("IApiHelper", {
	useClass: ApiHelper,
});

const pageComponentService = container.resolve(PageComponentService);
const pageLayoutService = container.resolve(PageLayoutService);

interface Params extends ParsedUrlQuery {
	slug: string;
}

export default class GetStaticPropHelper {
	static async getHomePageStaticProps(
		introName: string,
		collectionName: string
	) {
		try {
			const mainMenuItems = await pageLayoutService.getMainMenuItems();
			const footer = await pageLayoutService.getFooter();
			const banner = await pageComponentService.getBanner();
			const intro = await pageComponentService.getPageIntro(introName);
			const topics = await pageComponentService.getTopics();
			const blogList = await pageComponentService.getBlogs(collectionName);
			const props: HomeProps = {
				menu: mainMenuItems,
				footer: footer,
				banner: banner,
				pageIntro: intro,
				topics: topics,
				blogs: blogList,
			};
			return {
				props,
				revalidate: 3600,
			};
		} catch (e) {
			throw new Error(
				`${introName} page static generation failed. Error: ${e.message}`
			);
		}
	}
	static async getAboutPageStaticProps() {
		try {
			const mainMenuItems = await pageLayoutService.getMainMenuItems();
			const footer = await pageLayoutService.getFooter();
			const about = await pageComponentService.getAboutContent();
			const props: AboutPorps = {
				menu: mainMenuItems,
				footer: footer,
				about: about,
			};
			return {
				props,
				revalidate: 3600,
			};
		} catch (e) {
			throw new Error(
				`About page static generation failed. Error: ${e.message}`
			);
		}
	}
	static async getBlogListPageStaticProps(
		introName: string,
		collectionName: string
	) {
		try {
			const mainMenuItems = await pageLayoutService.getMainMenuItems();
			const footer = await pageLayoutService.getFooter();
			const intro = await pageComponentService.getPageIntro(introName);
			const blogList = await pageComponentService.getBlogs(collectionName);
			const props: BlogListProps = {
				menu: mainMenuItems,
				footer: footer,
				pageIntro: intro,
				blogs: blogList,
			};
			return {
				props,
				revalidate: 3600,
			};
		} catch (e) {
			throw new Error(
				`${introName} page static generation failed. Error: ${e.message}`
			);
		}
	}

	static async getBlogListStaticPaths(collectionName: string) {
		try {
			console.log("getBlogListStaticPaths " + collectionName);
			const blogList = await pageComponentService.getBlogs(collectionName);
			const paths = blogList.map((blogitem) => ({
				params: { slug: blogitem.id.toString() },
			}));
			return { paths, fallback: "blocking" };
		} catch (e) {
			throw new Error(
				`${collectionName} static path generation failed. Error: ${e.message}`
			);
		}
	}

	static async getBlogPageStaticProps(
		context: GetStaticPropsContext<ParsedUrlQuery>
	) {
		try {
			console.log("getBlogPageStaticProps");
			console.log(context);
			const params = context.params!;
			const mainMenuItems = await pageLayoutService.getMainMenuItems();
			const footer = await pageLayoutService.getFooter();
			const blog = await pageComponentService.getBlogById(
				params.slug as string
			);
			const props: BlogProps = {
				menu: mainMenuItems,
				footer: footer,
				blog: blog,
			};
			return {
				props,
				revalidate: 3600,
			};
		} catch (e) {
			throw new Error(
				`Blog page static generation failed. Error: ${e.message}`
			);
		}
	}
}
