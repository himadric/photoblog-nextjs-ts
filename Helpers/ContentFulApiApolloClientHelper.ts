import {
	GET_TOPICS_QUERY,
	GET_BANNER_QUERY,
	GET_ABOUT_QUERY,
	GET_MENU_QUERY,
	GET_BLOGIDS_QUERY,
	GET_BLOGBYSYSID_QUERY,
	GET_BLOGBYID_QUERY,
	GET_PAGEINTRO_QUERY,
	GET_FOOTER_QUERY,
} from "../graphql/ContentFulQueries";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import IApiHelper from "./IApiHelper";
import About from "../models/About";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import Footer from "../models/FooterModel";
import Menu from "../models/Menu";
import PageIntro from "../models/PageIntro";
import Topic from "../models/Topic";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

const previewOption: boolean =
	process.env.CONTENTFUL_PREVIEW_OPTION === "false" ||
	process.env.CONTENTFUL_PREVIEW_OPTION === undefined
		? false
		: true;

const accessToken = previewOption
	? process.env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN
	: process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN;

function formatDate(datetime: string) {
	var options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	} as Intl.DateTimeFormatOptions;
	var date = new Date(datetime);
	return date.toLocaleDateString("en-US", options);
}

const client = new ApolloClient({
	ssrMode: true,
	link: createHttpLink({
		uri: fetchUrl,
		credentials: "same-origin",
		headers: {
			Authorization: "Bearer " + accessToken,
			"Content-Type": "application/json",
		},
	}),
	cache: new InMemoryCache(),
});

export default class ContentFulApiApolloClientHelper implements IApiHelper {
	async getTopics(): Promise<Topic[]> {
		try {
			const { data } = await client.query({
				query: GET_TOPICS_QUERY,
				variables: { previewOption },
			});
			const { items } = data.topicCollection;
			return items.map(
				//Here is an example of why we cannot use ContentFul types with GraphQL queries
				//https://github.com/intercom/contentful-typescript-codegen/issues/17
				(topic: any) =>
					({
						id: topic.id,
						image: topic.image.url,
						imageAlt: topic.imageAlt,
						link: topic.link,
						buttonText: topic.buttonText,
					} as Topic)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Topics. Error: ${e.message}`);
		}
	}

	async getBanner(): Promise<Banner> {
		try {
			const { data } = await client.query({
				query: GET_BANNER_QUERY,
				variables: { previewOption },
			});
			const { items } = data.bannerCollection;
			const item = items[0];
			return {
				title: item.title,
				heading: item.heading,
				subHeading: item.subHeading,
				image: item.image.url,
				imageAlt: item.imageAlt,
			} as Banner;
		} catch (e: any) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}

	async getAboutContent(): Promise<About> {
		try {
			const { data } = await client.query({
				query: GET_ABOUT_QUERY,
				variables: { previewOption },
			});
			const { items } = data.aboutCollection;
			const item = items[0];
			return {
				title: item.title,
				body: documentToHtmlString(item.body.json),
				image: item.image.url,
				imageAlt: item.imageAlt,
				link: item.link,
			};
		} catch (e: any) {
			throw new Error(`Failed to get About content. Error: ${e.message}`);
		}
	}

	async getMainMenuItems(): Promise<Menu[]> {
		try {
			const { data } = await client.query({
				query: GET_MENU_QUERY,
				variables: { previewOption },
			});
			const { items } = data.menuCollection;
			return items.map(
				(menuItem: any) =>
					({
						id: menuItem.id,
						parentId: menuItem.parentId,
						menuCaption: menuItem.caption,
						menuLink: menuItem.link,
					} as Menu)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Menu. Error: ${e.message}`);
		}
	}

	async getBlogs(collectionName: string): Promise<Blog[]> {
		try {
			const { data } = await client.query({
				query: GET_BLOGIDS_QUERY,
				variables: { previewOption, collectionName },
			});
			const { items } = data.blogCategoryCollection.items[0].blogsCollection;
			return (await Promise.all(
				items.map(
					//Here is an example of why we cannot use ContentFul types with GraphQL queries
					//https://github.com/intercom/contentful-typescript-codegen/issues/17
					async (item: any) => (await this.getBlogBySysId(item.sys.id)) as Blog
				)
			)) as Blog[];
		} catch (e: any) {
			throw new Error(`Failed to get Blogs. Error: ${e.message}`);
		}
	}

	private async getBlogBySysId(sysId: string): Promise<Blog> {
		try {
			const { data } = await client.query({
				query: GET_BLOGBYSYSID_QUERY,
				variables: { previewOption, sysId },
			});
			const blog = {
				id: data.blog.id,
				image: data.blog.image.url,
				imageAlt: data.blog.imageAlt,
				publishDate: formatDate(data.blog.publishDate),
				readtime: data.blog.readTime,
				link: data.blog.link,
				title: data.blog.title,
				shortDescription: data.blog.shortDescription,
				body: documentToHtmlString(data.blog.body.json),
				noOfViews: 3,
				noOfComments: 4,
				noOfFavorites: 0,
			} as Blog;
			return blog;
		} catch (e: any) {
			throw new Error(`Failed to get Blog. Error: ${e.message}`);
		}
	}
	async getBlogById(id: string): Promise<Blog> {
		try {
			const { data } = await client.query({
				query: GET_BLOGBYID_QUERY,
				variables: { previewOption, id },
			});
			const { items } = data.blogCollection;
			const item = items[0];
			const blog = {
				id: item.id,
				image: item.image.url,
				imageAlt: item.imageAlt,
				publishDate: formatDate(item.publishDate),
				readtime: item.readTime,
				link: item.link,
				title: item.title,
				shortDescription: item.shortDescription,
				body: documentToHtmlString(item.body.json),
				noOfViews: 3,
				noOfComments: 4,
				noOfFavorites: 0,
			} as Blog;
			return blog;
		} catch (e: any) {
			throw new Error(`Failed to get Blog. Error: ${e.message}`);
		}
	}

	async getPageIntro(pageName: string): Promise<PageIntro> {
		try {
			const { data } = await client.query({
				query: GET_PAGEINTRO_QUERY,
				variables: { previewOption, pageName },
			});
			const { items } = data.pageIntroCollection;
			const item = items[0];
			return {
				id: item.id,
				pageName: item.pageName,
				title: item.title,
				body: documentToHtmlString(item.body.json),
			} as PageIntro;
		} catch (e: any) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}

	async getFooter(): Promise<Footer> {
		try {
			const { data } = await client.query({
				query: GET_FOOTER_QUERY,
				variables: { previewOption },
			});
			const { items } = data.footerCollection;
			const item = items[0];
			return {
				aboutMeHeading: item.aboutMeHeading,
				aboutMeQuote: item.aboutMeQuote,
				aboutMeImageLink: item.aboutMeImage.url,
				copyright: item.copyright,
				subscriptionHeading: item.subscriptionHeading,
				subscriptionButtonCaption: item.subscriptionButtonCaption,
				emailLabel: item.emailLabel,
			} as Footer;
		} catch (e: any) {
			throw new Error(`Failed to get Footer. Error: ${e.message}`);
		}
	}
}
