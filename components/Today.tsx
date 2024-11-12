import { gql, OperationVariables, useQuery } from '@apollo/client'
import { Link } from 'expo-router'
import { FC, ReactNode } from 'react'
import { Image, StyleSheet } from 'react-native'
import Markdown from 'react-native-markdown-display'
import FitImage from 'react-native-fit-image'
import { Text, View } from '@/components/Themed'
import Transits from '@/components/Transits'
import { markdownStyles } from '@/constants/Styles'
import {
  BlogPost,
  BlogPostQueryResponse,
  RenderMarkdownNode,
  MarkdownStyles,
} from '@/types/contentful'

const QUERY_TODAY_POST = gql`
  query blogPost($today: DateTime!) {
    blogPostCollection(
      where: { sys: { publishedAt_lte: $today } }
      order: sys_publishedAt_DESC
      limit: 2
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

const Today: FC = () => {
  const today = new Date().toString()
  const formattedToday = new Date(today).toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const { data } = useQuery<BlogPostQueryResponse, OperationVariables>(
    QUERY_TODAY_POST,
    {
      fetchPolicy: 'cache-and-network',
      variables: { today: new Date(today) },
    },
  )

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
      {date !== formattedToday ? (
        <>
          <Text style={styles.menu}>
            There may not be any direct transits today but you (and your
            stomach) are probably still feeling the weight these recently
            transiting bodies.{' '}
          </Text>
        </>
      ) : (
        <Text style={styles.menu}>On today's astrological menu:</Text>
      )}
      {post && (
        <>
          {post.heroImage && (
            <Image style={styles.hero} source={{ uri: post.heroImage.url }} />
          )}
          <Link href={`/${post?.slug}`} style={styles.title}>
            <Text style={styles.menu}>{date}</Text>
          </Link>

          {post.transitCollection && (
            <Transits transits={post.transitCollection.items} />
          )}

          {post.body && (
            <Markdown rules={rules} style={markdownStyles}>
              {post.body}
            </Markdown>
          )}
        </>
      )}
    </View>
  )
}

export default Today

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
