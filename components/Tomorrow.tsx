import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import Transits from '@/components/Transits'
import { FC } from 'react'
import { BlogPost, BlogPostQueryResponse } from '@/types/contentful'

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

  const { data } = useQuery<BlogPostQueryResponse, OperationVariables>(
    QUERY_TODAY_POST,
    {
      fetchPolicy: 'no-cache',
      variables: { tomorrow: new Date(tomorrow) },
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
      {post && (
        <View>
          <Text style={styles.menu}>On tomorrow's astrological menu: </Text>
          <Text>{date}</Text>
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
