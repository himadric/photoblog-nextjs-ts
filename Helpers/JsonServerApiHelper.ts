//import cacheData from "memory-cache";
import HttpsProxyAgent from "https-proxy-agent";
import IApiHelper from "./IApiHelper";
import About from "../models/About";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import Footer from "../models/FooterModel";
import Menu from "../models/Menu";
import PageIntro from "../models/PageIntro";
import Topic from "../models/Topic";

const apiBaseAddress: string | undefined = process.env.apiBaseAddress;

/*function formatDate(datetime){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var date  = new Date(datetime);
    return date.toLocaleDateString("en-US", options);
}*/

export default class ApiHelper implements IApiHelper {
	private async getFetchOptions() {
		const fetchOptions = {
			method: "GET",
			//Uncomment below line to see API requestion in Fiddler
			agent: HttpsProxyAgent("http://127.0.0.1:8888"),
			headers: {
				"Content-Type": "application/json",
			},
		};
		return fetchOptions;
	}
	async getTopics(): Promise<Topic[]> {
		try {
			const topics = await this.fetchData<Topic[]>("topics");
			return topics;
		} catch (e: any) {
			throw new Error(`Failed to get Topics. Error: ${e.message}`);
		}
	}

	async getBanner(): Promise<Banner> {
		try {
			const banner = await this.fetchData<Banner>("banner");
			return banner;
		} catch (e: any) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}

	async getAboutContent(): Promise<About> {
		try {
			const about = await this.fetchData<About>("about");
			return about;
		} catch (e: any) {
			throw new Error(`Failed to get About content. Error: ${e.message}`);
		}
	}

	async getMainMenuItems(): Promise<Menu[]> {
		try {
			const menus = await this.fetchData<Menu[]>("menus");
			return menus;
		} catch (e: any) {
			throw new Error(`Failed to get Menu. Error: ${e.message}`);
		}
	}

	async getBlogs(collectionName: string): Promise<Blog[]> {
		try {
			const blogs = await this.fetchData<Blog[]>(
				`blogs?collectionName=${collectionName}`
			);
			return blogs;
		} catch (e: any) {
			throw new Error(`Failed to get Blogs. Error: ${e.message}`);
		}
	}

	async getBlogById(id: string): Promise<Blog> {
		try {
			const blog = await this.fetchData<Blog>(`blogs/${id}`);
			return blog;
		} catch (e: any) {
			throw new Error(`Failed to get Blog. Error: ${e.message}`);
		}
	}

	async getPageIntro(pageName: string): Promise<PageIntro> {
		try {
			const pageIntro = await this.fetchData<PageIntro>(
				`pageIntro?pageName=${pageName}`
			);
			return pageIntro;
		} catch (e: any) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}

	async getFooter(): Promise<Footer> {
		try {
			const footer = await this.fetchData<Footer>("footer");
			return footer;
		} catch (e: any) {
			throw new Error(`Failed to get Footer. Error: ${e.message}`);
		}
	}

	private async fetchData<T>(endPoint: string): Promise<T> {
		const fetchOptions = await this.getFetchOptions();
		const response = await fetch(`${apiBaseAddress}/${endPoint}`, fetchOptions);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = (await response.json()) as Promise<T>;
		return data;
	}
}
