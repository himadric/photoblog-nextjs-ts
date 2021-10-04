import { injectable, inject } from "tsyringe";
import IApiHelper from "../Helpers/IApiHelper";
import About from "../models/About";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import PageIntro from "../models/PageIntro";
import Topic from "../models/Topic";

@injectable()
export default class PageComponentService {
	constructor(@inject("IApiHelper") private apiHelper: IApiHelper) {}

	async getBanner(): Promise<Banner> {
		try {
			const banner = await this.apiHelper.getBanner();
			return banner;
		} catch (e: any) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}
	async getAboutContent(): Promise<About> {
		try {
			const about = await this.apiHelper.getAboutContent();
			return about;
		} catch (e: any) {
			throw new Error(`Failed to get About. Error: ${e.message}`);
		}
	}
	async getPageIntro(pageName: string): Promise<PageIntro> {
		try {
			const pageIntro = await this.apiHelper.getPageIntro(pageName);
			return pageIntro;
		} catch (e: any) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}
	async getTopics(): Promise<Topic[]> {
		try {
			const topics = await this.apiHelper.getTopics();
			return topics;
		} catch (e: any) {
			throw new Error(`Failed to get topics. Error: ${e.message}`);
		}
	}
	async getBlogs(collectionName: string): Promise<Blog[]> {
		try {
			const blogs = await this.apiHelper.getBlogs(collectionName);
			return blogs;
		} catch (e: any) {
			throw new Error(`Failed to get blogs. Error: ${e.message}`);
		}
	}
	async getBlogById(id: string): Promise<Blog> {
		try {
			const blog = await this.apiHelper.getBlogById(id);
			return blog;
		} catch (e: any) {
			throw new Error(`Failed to get Blog. Error: ${e.message}`);
		}
	}
}
