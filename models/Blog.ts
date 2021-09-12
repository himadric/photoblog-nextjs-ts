export default interface Blog {
	id: string;
	collectionName?: string;
	image?: string;
	imageAlt?: string;
	publishDate?: string;
	readtime?: string;
	link: string;
	title: string;
	shortDescription: string;
	body: string;
	noOfViews?: number;
	noOfComments?: number;
	noOfFavorites?: number;
}
