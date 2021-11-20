import {
	GET_TOPICS_QUERY,
	GET_BANNER_QUERY,
	GET_ABOUT_QUERY,
	GET_MENU_QUERY,
	GET_BLOGIDS_QUERY,
	GET_BLOGBYID_QUERY,
	GET_PAGEINTRO_QUERY,
	GET_FOOTER_QUERY,
} from "../graphql/XEdgeQueries";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import IApiHelper from "./IApiHelper";
import About from "../models/About";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import Footer from "../models/FooterModel";
import Menu from "../models/Menu";
import PageIntro from "../models/PageIntro";
import Topic from "../models/Topic";

const previewOption: boolean =
	process.env.XEDGE_PREVIEW_OPTION === "false" ||
	process.env.XEDGE_PREVIEW_OPTION === undefined
		? false
		: true;

const apiKEy = previewOption
	? process.env.XEDGE_PREVIEW_API_KEY
	: process.env.XEDGE_DELIVERY_API_KEY;

const fetchUrl = previewOption
	? `https://nishtechxedgesandbox.sitecoresandbox.cloud/api/graphql/preview/v1`
	: `https://edge-beta.sitecorecloud.io/api/graphql/v1`;

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
			"X-GQL-Token": apiKEy as string,
		},
	}),
	cache: new InMemoryCache(),
});

export default class XEdgeApiApolloClientHelper implements IApiHelper {
	async getTopics(): Promise<Topic[]> {
		try {
			const { data } = await client.query({ query: GET_TOPICS_QUERY });
			const { results } = data.allM_Content_Topic;
			return results.map(
				(topic: any) =>
					({
						id: topic.topic_Image,
						image: topic.topic_Image,
						imageAlt: topic.topic_ImageAlt,
						link: topic.topic_Link,
						buttonText: topic.topic_ButtonText,
					} as Topic)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Topics. Error: ${e.message}`);
		}
	}

	async getBanner(): Promise<Banner> {
		try {
			const { data } = await client.query({ query: GET_BANNER_QUERY });
			const { results } = data.allM_Content_Banner;
			const item = results[0];
			return {
				title: item.banner_Title,
				heading: item.banner_Heading,
				subHeading: item.banner_SubHeadeing,
				image: item.banner_Image,
				imageAlt: item.banner_ImageAlt,
			} as Banner;
		} catch (e: any) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}

	async getAboutContent(): Promise<About> {
		try {
			const { data } = await client.query({ query: GET_ABOUT_QUERY });
			const { results } = data.allM_Content_About;
			const item = results[0];
			return {
				title: item.about_Title,
				body: item.about_Body,
				image: item.about_Image,
				imageAlt: item.about_ImageAlt,
				link: item.about_Link,
			};
		} catch (e: any) {
			throw new Error(`Failed to get About content. Error: ${e.message}`);
		}
	}

	async getMainMenuItems(): Promise<Menu[]> {
		try {
			const { data } = await client.query({ query: GET_MENU_QUERY });
			const { results } = data.allM_Content_Menu;
			return results.map(
				(menuItem: any) =>
					({
						id: menuItem.menu_Id,
						parentId: menuItem.menu_ParentId,
						menuCaption: menuItem.menu_Caption,
						menuLink: menuItem.menu_Link,
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
				variables: { collectionName },
			});
			const { results } =
				data.allM_ContentCollection.results[0].contentCollectionToContent;
			return await Promise.all(
				results.map(
					async (item: any) =>
						(await this.getBlogById(item.id as string)) as Blog
				)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Blogs. Error: ${e.message}`);
		}
	}

	private async getBlogByCollectionAndId(id: string): Promise<Blog> {
		try {
			const { data } = await client.query({
				query: GET_BLOGBYID_QUERY,
				variables: { id },
			});
			const blog = {
				id: data.m_Content_Blog.id,
				image: data.m_Content_Blog.blog_Image,
				imageAlt: data.m_Content_Blog.blog_ImageAlt,
				publishDate: formatDate(data.m_Content_Blog.content_PublishedOn),
				readtime: data.m_Content_Blog.blog_ReadTime,
				link: `${data.m_Content_Blog.blog_Link}/${id}`,
				title: data.m_Content_Blog.blog_Title,
				shortDescription: data.m_Content_Blog.blog_Quote,
				body: data.m_Content_Blog.blog_Body,
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
				variables: { id },
			});
			const blog = {
				id: data.m_Content_Blog.id,
				image: data.m_Content_Blog.blog_Image,
				imageAlt: data.m_Content_Blog.blog_ImageAlt,
				publishDate: formatDate(data.m_Content_Blog.content_PublishedOn),
				readtime: data.m_Content_Blog.blog_ReadTime,
				link: `${data.m_Content_Blog.blog_Link}/${id}`,
				title: data.m_Content_Blog.blog_Title,
				shortDescription: data.m_Content_Blog.blog_Quote,
				body: data.m_Content_Blog.blog_Body,
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
				variables: { pageName },
			});
			const { results } = data.allM_Content_PageIntro;
			const item = results[0];
			return {
				id: item.id,
				pageName: item.pageIntro_PageName,
				title: item.pageIntro_Title,
				body: item.pageIntro_Body,
			} as PageIntro;
		} catch (e: any) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}

	async getFooter(): Promise<Footer> {
		try {
			const { data } = await client.query({ query: GET_FOOTER_QUERY });
			const { results } = data.allM_Content_Footer;
			const item = results[0];
			return {
				aboutMeHeading: item.footer_AboutMeHeading,
				aboutMeQuote: item.footer_AboutMeQuote,
				aboutMeImageLink: item.footer_AboutMeImage,
				copyright: item.footer_Copyright,
				subscriptionHeading: item.footer_SubscriptionHeading,
				subscriptionButtonCaption: item.footer_SubscriptionButtonCaption,
				emailLabel: item.footer_EmailLabel,
			} as Footer;
		} catch (e: any) {
			throw new Error(`Failed to get Footer. Error: ${e.message}`);
		}
	}
}
