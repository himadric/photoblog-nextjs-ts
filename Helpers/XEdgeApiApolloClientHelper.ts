import { DocumentNode, gql } from "@apollo/client";
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
	? `http://experienceedgedemo1b.stylelabsdemo.com/api/graphql/preview/v1`
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
			const { results } = data.allM_Content_6b391;
			return results.map(
				(topic: any) =>
					({
						id: topic.id,
						image: topic._b391_Image,
						imageAlt: topic._b391_ImageAlt,
						link: topic._b391_Link,
						buttonText: topic._b391_ButtonText,
					} as Topic)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Topics. Error: ${e.message}`);
		}
	}

	async getBanner(): Promise<Banner> {
		try {
			const { data } = await client.query({ query: GET_BANNER_QUERY });
			const { results } = data.allM_Content_d4b32;
			const item = results[0];
			return {
				title: item.d4b32_Banner_Title,
				heading: item.d4b32_Banner_Heading,
				subHeading: item.d4b32_Banner_Sub_Heading,
				image: item.d4b32_Banner_Image,
				imageAlt: item.d4b32_Banner_Image_Alt,
			} as Banner;
		} catch (e: any) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}

	async getAboutContent(): Promise<About> {
		try {
			const { data } = await client.query({ query: GET_ABOUT_QUERY });
			const { results } = data.allM_Content_Blog;
			const item = results[0];
			return {
				title: item.blog_Title,
				body: item.blog_Body,
				image: item.blog_CoverImageLink,
				imageAlt: item.blog_CoverImageAlt,
				link: "/about",
			};
		} catch (e: any) {
			throw new Error(`Failed to get About content. Error: ${e.message}`);
		}
	}

	async getMainMenuItems(): Promise<Menu[]> {
		try {
			const { data } = await client.query({ query: GET_MENU_QUERY });
			const { results } = data.allM_Content_851fb;
			return results.map(
				(menuItem: any) =>
					({
						id: menuItem.id,
						parentId: menuItem._51fb_Parent_Id,
						menuCaption: menuItem._51fb_MenuCaption,
						menuLink: menuItem._51fb_MenuLink,
					} as Menu)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Menu. Error: ${e.message}`);
		}
	}

	async getBlogs(collectionName: string): Promise<Blog[]> {
		try {
			const { data } = await client.query({ query: GET_BLOGIDS_QUERY });
			const { results } = data.allM_Content_Blog;
			return await Promise.all(
				results.map(
					async (item: any) =>
						(await this.getBlogByCollectionAndId(
							collectionName,
							item.id as string
						)) as Blog
				)
			);
		} catch (e: any) {
			throw new Error(`Failed to get Blogs. Error: ${e.message}`);
		}
	}

	private async getBlogByCollectionAndId(
		collectionName: string,
		id: string
	): Promise<Blog> {
		try {
			const { data } = await client.query({
				query: GET_BLOGBYID_QUERY,
				variables: { id },
			});
			const blog = {
				id: data.m_Content_Blog.id,
				image: data.m_Content_Blog.blog_CoverImageLink,
				imageAlt: data.m_Content_Blog.blog_CoverImageAlt,
				publishDate: formatDate(data.m_Content_Blog.content_PublishedOn),
				readtime: data.m_Content_Blog.blog_ReadTime,
				link: `/${collectionName.toLowerCase()}/${id}`,
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
				image: data.m_Content_Blog.blog_CoverImageLink,
				imageAlt: data.m_Content_Blog.blog_CoverImageAlt,
				publishDate: formatDate(data.m_Content_Blog.content_PublishedOn),
				readtime: data.m_Content_Blog.blog_ReadTime,
				link: "/photography",
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
			const { results } = data.allM_Content_Blog;
			const item = results[0];
			return {
				id: item.id,
				pageName: item.content_Name,
				title: item.blog_Title,
				body: item.blog_Body,
			} as PageIntro;
		} catch (e: any) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}

	async getFooter(): Promise<Footer> {
		try {
			const { data } = await client.query({ query: GET_FOOTER_QUERY });
			const { results } = data.allM_Content_13de7;
			const item = results[0];
			return {
				aboutMeHeading: item._3de7_AboutMeHeading,
				aboutMeQuote: item._3de7_AboutMeQuote,
				aboutMeImageLink: item._3de7_AboutMeImageLink,
				copyright: item._3de7_Copyright,
				subscriptionHeading: item._3de7_SubscriptionHeading,
				subscriptionButtonCaption: item._3de7_SubscriptionButtonCaption,
				emailLabel: item._3de7_EmailLabel,
			} as Footer;
		} catch (e: any) {
			throw new Error(`Failed to get Footer. Error: ${e.message}`);
		}
	}
}
