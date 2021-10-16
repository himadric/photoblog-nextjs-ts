import { gql } from "@apollo/client";

export const GET_TOPICS_QUERY = gql`
	query GetTopics($previewOption: Boolean) {
		topicCollection(preview: $previewOption, order: [id_ASC]) {
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
	}
`;

export const GET_BANNER_QUERY = gql`
	query GetBanner($previewOption: Boolean) {
		bannerCollection(preview: $previewOption) {
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
	}
`;

export const GET_ABOUT_QUERY = gql`
	query GetAbout($previewOption: Boolean) {
		aboutCollection(preview: $previewOption) {
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
	}
`;

export const GET_MENU_QUERY = gql`
	query GetMenu($previewOption: Boolean) {
		menuCollection(preview: $previewOption, order: [id_ASC]) {
			items {
				id
				parentId
				caption
				link
			}
		}
	}
`;

export const GET_BLOGIDS_QUERY = gql`
	query GetBlogIds($previewOption: Boolean, $collectionName: String) {
		blogCategoryCollection(
			preview: $previewOption
			where: { name: $collectionName }
		) {
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
	}
`;

export const GET_BLOGBYSYSID_QUERY = gql`
	query GetBlogBySysId($previewOption: Boolean, $sysId: String!) {
		blog(preview: $previewOption, id: $sysId) {
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
	}
`;

export const GET_BLOGBYID_QUERY = gql`
	query GetBlogBySysId($previewOption: Boolean, $id: String) {
		blogCollection(preview: $previewOption, where: { id: $id }) {
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
	}
`;

export const GET_PAGEINTRO_QUERY = gql`
	query GetPageIntro($previewOption: Boolean, $pageName: String) {
		pageIntroCollection(
			preview: $previewOption
			where: { pageName: $pageName }
		) {
			items {
				id
				pageName
				title
				body {
					json
				}
			}
		}
	}
`;

export const GET_FOOTER_QUERY = gql`
	query GetFooter($previewOption: Boolean) {
		footerCollection(preview: $previewOption) {
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
	}
`;
