import { gql } from "@apollo/client";

export const GET_TOPICS_QUERY = gql`
	query {
		allM_Content_6b391 {
			results {
				id
				_b391_Image
				_b391_ImageAlt
				_b391_Link
				_b391_ButtonText
			}
		}
	}
`;

export const GET_BANNER_QUERY = gql`
	query {
		allM_Content_d4b32 {
			results {
				id
				d4b32_Banner_Title
				d4b32_Banner_Heading
				d4b32_Banner_Sub_Heading
				d4b32_Banner_Image
				d4b32_Banner_Image_Alt
			}
		}
	}
`;

export const GET_ABOUT_QUERY = gql`
	query {
		allM_Content_Blog(where: { content_Name_eq: "About" }) {
			results {
				blog_Title
				blog_Body
				blog_CoverImageLink
				blog_CoverImageAlt
			}
		}
	}
`;

export const GET_MENU_QUERY = gql`
	query {
		allM_Content_851fb {
			results {
				id
				_51fb_Parent_Id
				_51fb_MenuCaption
				_51fb_MenuLink
			}
		}
	}
`;

export const GET_BLOGIDS_QUERY = gql`
	query {
		allM_Content_Blog(where: { blog_Title_eq: "Yosemite" }) {
			results {
				id
			}
		}
	}
`;

export const GET_BLOGBYID_QUERY = gql`
	query GetBlogById($id: String) {
		m_Content_Blog(id: $id) {
			id
			blog_Title
			blog_Quote
			blog_Body
			blog_CoverImageLink
			blog_CoverImageAlt
			content_PublishedOn
			blog_ReadTime
		}
	}
`;

export const GET_PAGEINTRO_QUERY = gql`
	query GetPageIntro($pageName: String) {
		allM_Content_Blog(where: { content_Name_eq: $pageName }) {
			results {
				id
				content_Name
				blog_Title
				blog_Body
			}
		}
	}
`;

export const GET_FOOTER_QUERY = gql`
	query {
		allM_Content_13de7 {
			results {
				id
				_3de7_AboutMeHeading
				_3de7_AboutMeQuote
				_3de7_AboutMeImageLink
				_3de7_Copyright
				_3de7_SubscriptionHeading
				_3de7_EmailLabel
				_3de7_SubscriptionButtonCaption
			}
		}
	}
`;
