import HttpsProxyAgent from "https-proxy-agent";
import cacheData from "memory-cache";
import IApiHelper from "./IApiHelper";
import About from "../models/About";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import Footer from "../models/FooterModel";
import Menu from "../models/Menu";
import PageIntro from "../models/PageIntro";
import Topic from "../models/Topic";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const getTopicsCacheKey: string = "getTopics";
const getBannerCacheKey: string = "getBanner";
const getAboutContentCacheKey: string = "getAbout";
const getMainMenuItemsCacheKey: string = "getMainMenuItems";
const getBlogsFromCollectionCacheKey: string = "getBlogsFromCollection";
const getPageIntroCacheKey: string = "getPageIntro";
const getBlogByIdCacheKey: string = "getBlogById";
const getFooterCacheKey: string = "getFooter";

const cacheDuration = 1000 * Number(process.env.CONTENT_CACHE_DURATION);

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
export default class ContentFulApiFetchHelper implements IApiHelper {
	private async getFetchOptions(query: string) {
		const fetchOptions = {
			method: "POST",
			//Uncomment below line to see API requestion in Fiddler
			//agent: HttpsProxyAgent("http://127.0.0.1:8888"),
			headers: {
				Authorization: "Bearer " + accessToken,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ query }),
		};
		return fetchOptions;
	}
	async getTopics(): Promise<Topic[]> {
		try {
			let topics = cacheData.get(getTopicsCacheKey);
			if (topics) {
				return topics;
			} else {
				const query: string = `query {
					topicCollection(preview: ${previewOption}, order: [id_ASC]) {
					  items {
						id
						image {
						  url
						}
						imageAlt
						link
						buttonText
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { topicCollection } = res.data;
				topics = topicCollection.items.map(
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
				cacheData.put(getTopicsCacheKey, topics, cacheDuration);
				return topics;
			}
		} catch (e: any) {
			throw new Error(`Failed to get Topics. Error: ${e.message}`);
		}
	}

	async getBanner(): Promise<Banner> {
		try {
			let banner = cacheData.get(getBannerCacheKey);
			if (banner) {
				return banner;
			} else {
				const query: string = `query {
					bannerCollection(preview: ${previewOption}) {
					  items {
						image {
							url
						  }
						imageAlt
						title
						heading
						subHeading
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } = res.data.bannerCollection;
				const item = items[0];
				banner = {
					title: item.title,
					heading: item.heading,
					subHeading: item.subHeading,
					image: item.image.url,
					imageAlt: item.imageAlt,
				} as Banner;
				cacheData.put(getBannerCacheKey, banner, cacheDuration);
				return banner;
			}
		} catch (e: any) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}

	async getAboutContent(): Promise<About> {
		try {
			let about = cacheData.get(getAboutContentCacheKey);
			if (about) {
				return about;
			} else {
				const query: string = `query {
					aboutCollection(preview: ${previewOption}) {
					  items {
						title
						body {
						  json
						}
						image {
						  url
						}
						imageAlt
						link
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } = res.data.aboutCollection;
				const item = items[0];
				about = {
					title: item.title,
					body: documentToHtmlString(item.body.json),
					image: item.image.url,
					imageAlt: item.imageAlt,
					link: item.link,
				};
				cacheData.put(getAboutContentCacheKey, about, cacheDuration);
				return about;
			}
		} catch (e: any) {
			throw new Error(`Failed to get About content. Error: ${e.message}`);
		}
	}

	async getMainMenuItems(): Promise<Menu[]> {
		try {
			let menuItems = cacheData.get(getMainMenuItemsCacheKey);
			if (menuItems) {
				return menuItems;
			} else {
				const query: string = `query {
					menuCollection(preview: ${previewOption}, order: [id_ASC]) {
					  items {
						id
						parentId
						caption
						link
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } = res.data.menuCollection;
				menuItems = items.map(
					(menuItem: any) =>
						({
							id: menuItem.id,
							parentId: menuItem.parentId,
							menuCaption: menuItem.caption,
							menuLink: menuItem.link,
						} as Menu)
				);
				cacheData.put(getMainMenuItemsCacheKey, menuItems, cacheDuration);
				return menuItems;
			}
		} catch (e: any) {
			throw new Error(`Failed to get Menu. Error: ${e.message}`);
		}
	}

	async getBlogs(collectionName: string): Promise<Blog[]> {
		try {
			const cacheKey = [getBlogsFromCollectionCacheKey, collectionName].join(
				""
			);
			let blogs = cacheData.get(cacheKey);
			if (blogs) {
				return blogs;
			} else {
				const query: string = `query {
					blogCategoryCollection(preview: ${previewOption}, where: {
					name: "${collectionName}"
				  }) {
					items {
					  name
					  blogsCollection {
						items {
						  sys {
							id
						  }
						}
					  }
					}
				  }
				}`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } =
					res.data.blogCategoryCollection.items[0].blogsCollection;
				blogs = await Promise.all(
					items.map(
						//Here is an example of why we cannot use ContentFul types with GraphQL queries
						//https://github.com/intercom/contentful-typescript-codegen/issues/17
						async (item: any) =>
							(await this.getBlogBySysId(item.sys.id)) as Blog
					)
				);
				cacheData.put(cacheKey, blogs, cacheDuration);
				return blogs as Blog[];
			}
		} catch (e: any) {
			throw new Error(`Failed to get Blogs. Error: ${e.message}`);
		}
	}

	private async getBlogBySysId(sysId: string): Promise<Blog> {
		try {
			const query: string = `query {
				blog(preview: ${previewOption}, id: "${sysId}") {
				  id
				  title
				  shortDescription
				  body {
					json
				  }
				  image {
					url
				  }
				  link
				  imageAlt
				  publishDate
				  readTime
				}
			  }`;
			const fetchOptions = await this.getFetchOptions(query);
			const response = await fetch(fetchUrl, fetchOptions);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const res = await response.json();
			const blog = {
				id: res.data.blog.id,
				image: res.data.blog.image.url,
				imageAlt: res.data.blog.imageAlt,
				publishDate: formatDate(res.data.blog.publishDate),
				readtime: res.data.blog.readTime,
				link: res.data.blog.link,
				title: res.data.blog.title,
				shortDescription: res.data.blog.shortDescription,
				body: documentToHtmlString(res.data.blog.body.json),
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
			const cacheKey = [getBlogByIdCacheKey, id].join("");
			let blog = cacheData.get(cacheKey);
			if (blog) {
				return blog;
			} else {
				const query: string = `query {
					blogCollection(preview: ${previewOption}, where: {
					  id: "${id}"
					}) {
					  items {
						sys {
						  id
						}
						id
						title
						shortDescription
						body {
						  json
						}
						image {
						  url
						}
						imageAlt
						link
						publishDate
						readTime
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } = res.data.blogCollection;
				const item = items[0];
				blog = {
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
				cacheData.put(cacheKey, blog, cacheDuration);
				return blog;
			}
		} catch (e: any) {
			throw new Error(`Failed to get Blog. Error: ${e.message}`);
		}
	}

	async getPageIntro(pageName: string): Promise<PageIntro> {
		try {
			const cacheKey = [getPageIntroCacheKey, pageName].join("");
			let pageIntro = cacheData.get(cacheKey);
			if (pageIntro) {
				return pageIntro;
			} else {
				const query: string = `query {
					pageIntroCollection(preview: ${previewOption}, where: {
					  pageName: "${pageName}"
					}) {
					  items {
						id
						pageName
						title
						body {
						  json
						}
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } = res.data.pageIntroCollection;
				const item = items[0];
				pageIntro = {
					id: item.id,
					pageName: item.pageName,
					title: item.title,
					body: documentToHtmlString(item.body.json),
				} as PageIntro;
				cacheData.put(cacheKey, pageIntro, cacheDuration);
				return pageIntro;
			}
		} catch (e: any) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}

	async getFooter(): Promise<Footer> {
		try {
			let footer = cacheData.get(getFooterCacheKey);
			if (footer) {
				return footer;
			} else {
				const query: string = `query {
					footerCollection(preview: ${previewOption}) {
					  items {
						aboutMeHeading
						aboutMeQuote
						aboutMeImage {
						  url
						}
						copyright
						subscriptionHeading
						emailLabel
						subscriptionButtonCaption
					  }
					}
				  }`;
				const fetchOptions = await this.getFetchOptions(query);
				const response = await fetch(fetchUrl, fetchOptions);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const res = await response.json();
				const { items } = res.data.footerCollection;
				const item = items[0];
				footer = {
					aboutMeHeading: item.aboutMeHeading,
					aboutMeQuote: item.aboutMeQuote,
					aboutMeImageLink: item.aboutMeImage.url,
					copyright: item.copyright,
					subscriptionHeading: item.subscriptionHeading,
					subscriptionButtonCaption: item.subscriptionButtonCaption,
					emailLabel: item.emailLabel,
				} as Footer;
				cacheData.put(getFooterCacheKey, footer, cacheDuration);
				return footer;
			}
		} catch (e: any) {
			throw new Error(`Failed to get Footer. Error: ${e.message}`);
		}
	}
}
