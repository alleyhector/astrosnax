import { gql } from '@apollo/client'

const TRANSIT_FRAGMENT = gql`
  fragment TransitFields on Transit {
    title
    planet
    sign
    aspect
    transitingPlanet
    transitingSign
    foods
  }
`
const POST_FRAGMENT = gql`
  fragment PostFields on BlogPost {
    sys {
      publishedAt
    }
    title
    slug
    author {
      name
    }
    publishDate
    description
    body
    heroImage {
      url
    }
    transitCollection(where: { sys: { publishedAt_exists: true } }) {
      items {
        ...TransitFields
      }
    }
  }
  ${TRANSIT_FRAGMENT}
`
export const QUERY_POST = gql`
  query blogPost($slug: String) {
    blogPostCollection(where: { slug: $slug }) {
      items {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`
export const QUERY_POSTS = gql`
  query blogPosts($today: DateTime!, $skip: Int, $limit: Int) {
    blogPostCollection(
      where: { publishDate_lte: $today }
      order: publishDate_DESC
      skip: $skip
      limit: $limit
    ) {
      items {
        ...PostFields
      }
      total
    }
  }
  ${POST_FRAGMENT}
`
export const QUERY_TODAY_POST = gql`
  query blogPost($today: DateTime!) {
    blogPostCollection(
      where: { publishDate_lte: $today }
      order: publishDate_DESC
      limit: 2
    ) {
      items {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`
export const QUERY_TOMORROW_POST = gql`
  query blogPost($today: DateTime!) {
    blogPostCollection(
      where: { publishDate_lte: $tomorrow }
      order: publishDate_DESC
      limit: 2
    ) {
      items {
        ...PostFields
      }
    }
  }
  ${POST_FRAGMENT}
`
export const QUERY_ABOUT = gql`
  {
    aboutCollection {
      items {
        name
        description
        aboutMe
        profile {
          url
        }
      }
    }
  }
`
