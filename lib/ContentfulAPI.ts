import { ApolloClient, InMemoryCache } from '@apollo/client'

const contentfulKey = process.env.EXPO_PUBLIC_CONTENTFUL_KEY
const contentfulEnvironment =
  process.env.EXPO_PUBLIC_CONTENTFUL_ENVIRONMENT ?? 'master'

if (!contentfulKey || !process.env.EXPO_PUBLIC_CONTENTFUL_ENVIRONMENT) {
  // Soft-fail so the merge Garden stub can boot without Contentful secrets.
  // Today / Archive / About still need real env vars to fetch content.
  console.warn(
    'Contentful environment variables are not defined; content tabs will not load.',
  )
}

export const cache = new InMemoryCache()

export const client = new ApolloClient({
  uri: `https://graphql.contentful.com/content/v1/spaces/125gutb64ghd/environments/${contentfulEnvironment}`,
  cache,
  credentials: 'same-origin',
  headers: {
    Authorization: `Bearer ${contentfulKey ?? ''}`,
  },
})
