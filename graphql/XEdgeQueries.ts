import { gql } from "@apollo/client";

export const GET_TOPICS_QUERY = gql`
	query {
		allM_Content_Topic {
			results {
				topic_Id
				topic_Link
				topic_Image
				topic_ImageAlt
				topic_ButtonText
			}
		}
	}
`;

export const GET_BANNER_QUERY = gql`
	query {
		allM_Content_Banner {
			results {
				id
				banner_Title
				banner_Heading
				banner_SubHeadeing
				banner_Image
				banner_ImageAlt
			}
		}
	}
`;

export const GET_ABOUT_QUERY = gql`
	query {
		allM_Content_About {
			results {
				about_Title
				about_Body
				about_Image
				about_ImageAlt
				about_Link
			}
		}
	}
`;

export const GET_MENU_QUERY = gql`
	query {
		allM_Content_Menu(orderBy: [MENU_ID_ASC]) {
			results {
				menu_Id
				menu_ParentId
				menu_Caption
				menu_Link
			}
		}
	}
`;

export const GET_BLOGIDS_QUERY = gql`
	query GetBlogIds($collectionName: String) {
		allM_ContentCollection(
			where: { contentCollectionName_eq: $collectionName }
		) {
			results {
				contentCollectionName
				contentCollectionToContent {
					results {
						id
					}
				}
			}
		}
	}
`;

export const GET_BLOGBYID_QUERY = gql`
	query GetBlogById($id: String!) {
		m_Content_Blog(id: $id) {
			id
			blog_Title
			blog_Quote
			blog_Body
			blog_Image
			blog_ImageAlt
			blog_ReadTime
			blog_Link
			content_PublishedOn
		}
	}
`;

export const GET_PAGEINTRO_QUERY = gql`
	query GetPageIntro($pageName: String) {
		allM_Content_PageIntro(where: { content_Name_eq: $pageName }) {
			results {
				id
				pageIntro_Id
				pageIntro_Body
				pageIntro_Title
				pageIntro_PageName
			}
		}
	}
`;

export const GET_FOOTER_QUERY = gql`
	query {
		allM_Content_Footer {
			results {
				id
				footer_AboutMeHeading
				footer_AboutMeQuote
				footer_AboutMeImage
				footer_Copyright
				footer_SubscriptionHeading
				footer_EmailLabel
				footer_SubscriptionButtonCaption
			}
		}
	}
`;
