import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "https://edge-beta.sitecorecloud.io/api/graphql/v1",
	cache: new InMemoryCache(),
});

export default client;
