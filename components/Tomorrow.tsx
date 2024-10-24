import { Image, StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import { Href, Link } from 'expo-router'
import { gql, useQuery } from '@apollo/client'
import Transits from '@/components/Transits'
import Markdown from 'react-native-markdown-display'
import FitImage from 'react-native-fit-image'
import { markdownStyles } from '@/constants/Styles'
import { FC, ReactNode } from 'react'
import {
  BlogPost,
  BlogPostQueryResponse,
  BlogPostQueryVariables,
  RenderMarkdownNode,
  MarkdownStyles,
} from '@/types/contentful'

const QUERY_TODAY_POST = gql`
  query blogPost($tomorrow: DateTime!) {
    blogPostCollection(
      where: { sys: { publishedAt_lte: $tomorrow } }
      order: sys_publishedAt_DESC
      limit: 1
    ) {
      items {
        sys {
          publishedAt
        }
        title
        slug
        author {
          name
        }
        description
        body
        heroImage {
          url
        }
        transitCollection {
          items {
            title
            planet
            sign
            aspect
            transitingPlanet
            transitingSign
            foods
          }
        }
      }
    }
  }
`
const rules = {
  image: (
    node: RenderMarkdownNode,
    children: ReactNode[],
    parent: any,
    styles: MarkdownStyles,
  ) => {
    const { src, alt } = node.attributes

    const imageProps = {
      indicator: true,
      key: node.key,
      style: styles._VIEW_SAFE_image,
      source: {
        uri: `https:${src}`,
        alt,
      },
    }

    return <FitImage {...imageProps} />
  },
}

const Tomorrow: FC = () => {
  const today = new Date()
  const tomorrow = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate() + 1,
    8,
    0,
    0,
  )

  const { data, loading, refetch } = useQuery<
    BlogPostQueryResponse,
    BlogPostQueryVariables
  >(QUERY_TODAY_POST, {
    fetchPolicy: 'no-cache',
    variables: { tomorrow: new Date(tomorrow) },
  })

  const post: BlogPost | undefined = data?.blogPostCollection?.items[0]
  const date: string | undefined = new Date(
    post?.sys?.publishedAt!,
  ).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <View style={styles.container}>
      {post && (
        <View>
          <Text style={styles.menu}>On tomorrow's astrological menu: </Text>
          <Transits transits={post.transitCollection.items} />
        </View>
      )}
    </View>
  )
}

export default Tomorrow

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  menu: {
    fontFamily: 'AngelClub',
    fontSize: 20,
    margin: 10,
  },
  title: {
    fontFamily: 'AngelClub',
    alignSelf: 'flex-end',
    fontSize: 24,
    margin: 10,
  },
})
