import { ApolloClient, InMemoryCache } from '@apollo/client'

export const cache = new InMemoryCache()

export const client = new ApolloClient({
  uri: `https://graphql.contentful.com/content/v1/spaces/125gutb64ghd/environments/${process.env.EXPO_PUBLIC_CONTENTFUL_ENVIRONMENT}`,
  cache,
  credentials: 'same-origin',
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_CONTENTFUL_KEY}`,
  },
})
