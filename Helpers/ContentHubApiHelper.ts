import cacheData from "memory-cache";
import OAuthPasswordGrant from "@sitecore/sc-contenthub-webclient-sdk/dist/authentication/oauth-password-grant";
import { ContentHubClient } from "@sitecore/sc-contenthub-webclient-sdk/dist/clients/content-hub-client";
import { PropertyQueryFilter } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/filters/property-query-filter";
import { FilterDataType } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/filters/filter-data-type";
import { ComparisonOperator } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/filters/comparison-operator";
import { Query } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/query";
import { RelationQueryFilter } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/filters/relation-query-filter";
import IApiHelper from "./IApiHelper";
import Topic from "../models/Topic";
import About from "../models/About";
import Menu from "../models/Menu";
import Blog from "../models/Blog";
import PageIntro from "../models/PageIntro";
import Footer from "../models/FooterModel";
import { IEntity } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/base/entity";
import { IEntityQueryResult } from "@sitecore/sc-contenthub-webclient-sdk/dist/contracts/querying/entity-query-result";

const contentHubEndPoint: string | undefined = process.env.contentHubEndPoint;
const clientId: string = process.env.clientId as string;
const clientSecret: string = process.env.clientSecret as string;
const username: string = process.env.userId as string;
const password: string = process.env.password as string;

const getContentHubClientCacheKey: string = "getContentHubClient";
const getTopicCardsCacheKey: string = "getTopicCards";
const getBannerContentCacheKey: string = "getBannerContent";
const getWelcomeMessageCacheKey: string = "getWelcomeMessage";
const getAboutContentCacheKey: string = "getAboutContent";
const getMainMenuItemsCacheKey: string = "getMainMenuItems";
const getBlogsFromCollectionCacheKey: string = "getBlogsFromCollection";
const getPageIntroCacheKey: string = "getPageIntro";
const getBlogByIdCacheKey: string = "getBlogById";
const getFooterCacheKey: string = "getFooter";

const cacheDuration = 1000 * 60 * 60;
const sleepInterval = 1000;

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

async function sleep(sleepDuration: number) {
	await new Promise((r) => setTimeout(r, sleepDuration));
}

export default class ContentHubApiHelper implements IApiHelper {
	async getTopics(): Promise<Topic[]> {
		try {
			const topics = await this.getTopicCardsFromContentHub();
			return topics;
		} catch (e) {
			throw new Error(`Failed to get Topics. Error: ${e.message}`);
		}
	}

	async getBanner() {
		try {
			const banner = await this.getBannerFromContentHub();
			return banner;
		} catch (e) {
			throw new Error(`Failed to get Banner. Error: ${e.message}`);
		}
	}

	async getAboutContent(): Promise<About> {
		try {
			const about = await this.getAboutFromContentHub();
			return about;
		} catch (e) {
			throw new Error(`Failed to get About content. Error: ${e.message}`);
		}
	}

	async getMainMenuItems(): Promise<Menu[]> {
		try {
			const menus = await this.getMainMenuItemsFromContentHub();
			return menus;
		} catch (e) {
			throw new Error(`Failed to get Menu. Error: ${e.message}`);
		}
	}

	async getBlogs(collectionName: string): Promise<Blog[]> {
		try {
			const blogs = await this.getBlogsFromCollectionFromContentHub(
				collectionName
			);
			return blogs;
		} catch (e) {
			throw new Error(`Failed to get Blogs. Error: ${e.message}`);
		}
	}

	async getBlogById(id: string): Promise<Blog> {
		try {
			const blog = await this.getBlogByIdFromContentHub(id);
			return blog;
		} catch (e) {
			throw new Error(`Failed to get Blog. Error: ${e.message}`);
		}
	}

	async getPageIntro(pageName: string): Promise<PageIntro> {
		try {
			const pageIntro = await this.getPageIntroFromContentHub(pageName);
			return pageIntro;
		} catch (e) {
			throw new Error(`Failed to get PageIntro. Error: ${e.message}`);
		}
	}

	async getFooter(): Promise<Footer> {
		try {
			const footer = await this.getFooterFromContentHub();
			return footer;
		} catch (e) {
			throw new Error(`Failed to get Footer. Error: ${e.message}`);
		}
	}

	private async getContentHubClient(): Promise<ContentHubClient> {
		let client = cacheData.get(getContentHubClientCacheKey);
		if (client) {
			return client;
		} else {
			//fetch data from external source
			// Your Sitecore Content Hub endpoint to connect to
			// Enter your credentials here
			const oauth = new OAuthPasswordGrant(
				clientId,
				clientSecret,
				username,
				password
			);

			// Create the JavaScript SDK client
			const client = new ContentHubClient(contentHubEndPoint, oauth);
			if (await client.internalClient.authenticateAsync()) {
				cacheData.put(getContentHubClientCacheKey, client, cacheDuration);
				await sleep(sleepInterval);
				return client;
			} else {
				throw new Error("Failed to authenticate.");
			}
		}
	}

	private async getBannerFromContentHub() {
		let client = await this.getContentHubClient();
		let banner = cacheData.get(getBannerContentCacheKey);
		if (banner) {
			return banner;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "Content.Name",
				value: "HomeBanner",
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});
			var content: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);
			banner = {
				title: content?.getPropertyValue("d4b32_Banner_Title"),
				heading: content?.getPropertyValue("d4b32_Banner_Heading"),
				subHeading: content?.getPropertyValue("d4b32_Banner_Sub_Heading"),
				image: content?.getPropertyValue("d4b32_Banner_Image"),
				imageAlt: content?.getPropertyValue("d4b32_Banner_Image_Alt"),
			};
			cacheData.put(getBannerContentCacheKey, banner, cacheDuration);
			return banner;
		}
	}

	private async getWelcomeMessageFromContentHub() {
		let client = await this.getContentHubClient();
		let welcomeMessage = cacheData.get(getWelcomeMessageCacheKey);
		if (welcomeMessage) {
			return welcomeMessage;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "Content.Name",
				value: "HomeWelcomeMessage",
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});
			var content: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);
			welcomeMessage = {
				title: content?.getPropertyValue("Blog_Title"),
				body: content?.getPropertyValue("Blog_Body"),
			};
			cacheData.put(getWelcomeMessageCacheKey, welcomeMessage, cacheDuration);
			return welcomeMessage;
		}
	}

	private async getTopicCardsFromContentHub() {
		let client = await this.getContentHubClient();
		let topicCards = cacheData.get(getTopicCardsCacheKey);
		if (topicCards) {
			return topicCards;
		} else {
			//Get the Topic Cards collection
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "ContentCollectionName",
				value: "Topic Cards",
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});

			var topicCardsCollection: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);

			//Get all Topic Cards from the collection
			var relationQueryFilter = new RelationQueryFilter({
				relation: "ContentCollectionToContent",
				parentId: topicCardsCollection?.id,
			});

			var relationQuery = new Query({
				filter: relationQueryFilter,
			});

			var relation: IEntityQueryResult | null = await (
				await client
			).querying.queryAsync(relationQuery);
			await sleep(sleepInterval);
			let topicCards = relation.items.map((topicCard) => ({
				id: topicCard.identifier,
				image: topicCard?.getPropertyValue("6b391_Image"),
				imageAlt: topicCard?.getPropertyValue("6b391_ImageAlt"),
				link: topicCard?.getPropertyValue("6b391_Link"),
				buttonText: topicCard?.getPropertyValue("6b391_ButtonText"),
			}));
			cacheData.put(getTopicCardsCacheKey, topicCards, cacheDuration);
			return topicCards;
		}
	}

	private async getAboutFromContentHub() {
		let client = await this.getContentHubClient();
		let about = cacheData.get(getAboutContentCacheKey);
		if (about) {
			return about;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "Content.Name",
				value: "About",
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});
			var content: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);
			about = {
				title: content?.getPropertyValue("Blog_Title"),
				body: content?.getPropertyValue("Blog_Body"),
				image: content?.getPropertyValue("CoverImageLink"),
			};
			cacheData.put(getAboutContentCacheKey, about, cacheDuration);
			return about;
		}
	}

	private async getMainMenuItemsFromContentHub() {
		let client = await this.getContentHubClient();
		let menuItems = cacheData.get(getMainMenuItemsCacheKey);
		if (menuItems) {
			return menuItems;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "ContentCollectionName",
				value: "Main Menu",
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});

			var mainMenuCollection: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);

			//Get all Menu Items from the collection
			var relationQueryFilter = new RelationQueryFilter({
				relation: "ContentCollectionToContent",
				parentId: mainMenuCollection?.id,
			});

			var relationQuery = new Query({
				filter: relationQueryFilter,
			});

			var relation: IEntityQueryResult | null = await (
				await client
			).querying.queryAsync(relationQuery);
			await sleep(sleepInterval);
			menuItems = relation.items.map((mainMenuItem) => ({
				id: mainMenuItem.identifier,
				parentId: mainMenuItem?.getPropertyValue("851fb_Parent_Id"),
				menuCaption: mainMenuItem?.getPropertyValue("851fb_MenuCaption"),
				menuLink: mainMenuItem?.getPropertyValue("851fb_MenuLink"),
			}));
			cacheData.put(getMainMenuItemsCacheKey, menuItems, cacheDuration);
		}
		return menuItems;
	}

	private async getBlogsFromCollectionFromContentHub(
		contentCollectionName: string
	) {
		let client = await this.getContentHubClient();
		const cacheKey = [
			getBlogsFromCollectionCacheKey,
			contentCollectionName,
		].join("");
		let blogs = cacheData.get(cacheKey);
		if (blogs) {
			return blogs;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "ContentCollectionName",
				value: contentCollectionName,
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});

			var blogCollection: IEntity | null = await (
				await client
			).querying.singleAsync(query);

			await sleep(sleepInterval);

			//Get all Topic Cards from the collection
			const relationQueryFilter = new RelationQueryFilter({
				relation: "ContentCollectionToContent",
				parentId: blogCollection?.id,
			});

			const relationQuery = new Query({
				filter: relationQueryFilter,
			});

			var relation: IEntityQueryResult | null = await (
				await client
			).querying.queryAsync(relationQuery);
			await sleep(sleepInterval);
			blogs = relation.items.map((blog) => ({
				id: blog.id,
				collectionName: contentCollectionName,
				image: blog.getPropertyValue("Blog_CoverImageLink"),
				imageAlt: blog.getPropertyValue("Blog_CoverImageAlt"),
				publishDate: formatDate(
					blog.getPropertyValue("Content.PublishedOn") as string
				),
				readtime: blog.getPropertyValue("Blog_ReadTime"),
				link: ["/", contentCollectionName.toLowerCase(), "/", blog.id].join(""),
				title: blog.getPropertyValue("Blog_Title"),
				shortDescription: blog.getPropertyValue("Blog_Quote"),
				body: blog.getPropertyValue("Blog_Body"),
				noOfViews: 3,
				noOfComments: 0,
				noOfFavorites: 3,
			}));
			cacheData.put(cacheKey, blogs, cacheDuration);
			return blogs;
		}
	}

	private async getPageIntroFromContentHub(contentName: string) {
		let client = await this.getContentHubClient();
		const cacheKey = [getPageIntroCacheKey, contentName].join("");
		let pageIntro = cacheData.get(cacheKey);
		if (pageIntro) {
			return pageIntro;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "Content.Name",
				value: contentName,
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});

			var content: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);
			pageIntro = {
				id: content?.id,
				pageName: contentName,
				title: content?.getPropertyValue("Blog_Title"),
				body: content?.getPropertyValue("Blog_Body"),
			};
			cacheData.put(cacheKey, pageIntro, cacheDuration);
			return pageIntro;
		}
	}

	private async getBlogByIdFromContentHub(id: string) {
		let client = await this.getContentHubClient();
		const cacheKey = [getBlogByIdCacheKey, id].join("");
		let blog = cacheData.get(cacheKey);
		if (blog) {
			return blog;
		} else {
			let entity: IEntity | null = await (
				await client
			).entities.getAsync(Number(id));
			await sleep(sleepInterval);
			blog = {
				id: entity?.id,
				image: entity?.getPropertyValue("Blog_CoverImageLink"),
				imageAlt: entity?.getPropertyValue("Blog_CoverImageAlt"),
				publishDate: formatDate(
					entity?.getPropertyValue("Content.PublishedOn") as string
				),
				readTime: entity?.getPropertyValue("Blog_ReadTime"),
				title: entity?.getPropertyValue("Blog_Title"),
				shortDescription: entity?.getPropertyValue("Blog_Quote"),
				body: entity?.getPropertyValue("Blog_Body"),
				noOfViews: 3,
				noOfComments: 0,
				noOfFavorites: 3,
			};
			console.log(blog);
			cacheData.put(cacheKey, blog, cacheDuration);
			return blog;
		}
	}

	private async getFooterFromContentHub() {
		let client = await this.getContentHubClient();
		let footer = cacheData.get(getFooterCacheKey);
		if (footer) {
			return footer;
		} else {
			var propertyQueryFilter = new PropertyQueryFilter({
				operator: ComparisonOperator.Equals,
				property: "Content.Name",
				value: "Footer",
				dataType: FilterDataType.String,
			});

			var query = new Query({
				filter: propertyQueryFilter,
			});

			var footerEntity: IEntity | null = await (
				await client
			).querying.singleAsync(query);
			await sleep(sleepInterval);
			footer = {
				aboutMeHeading: footerEntity?.getPropertyValue("13de7_AboutMeHeading"),
				aboutMeQuote: footerEntity?.getPropertyValue("13de7_AboutMeQuote"),
				aboutMeImageLink: footerEntity?.getPropertyValue(
					"13de7_AboutMeImageLink"
				),
				copyright: footerEntity?.getPropertyValue("13de7_Copyright"),
				subscriptionHeading: footerEntity?.getPropertyValue(
					"13de7_SubscriptionHeading"
				),
				emailLabel: footerEntity?.getPropertyValue("13de7_EmailLabel"),
				subscriptionButtonCaption: footerEntity?.getPropertyValue(
					"13de7_SubscriptionButtonCaption"
				),
			};
			cacheData.put(getFooterCacheKey, footer, cacheDuration);
			return footer;
		}
	}
}
