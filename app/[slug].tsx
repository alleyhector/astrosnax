import { Image, StyleSheet, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import Markdown from 'react-native-markdown-display'
import Transits from '@/components/Transits'
import { markdownStyles } from '@/constants/Styles'
import { Text, View } from '@/components/Themed'
import { BlogPostQueryResponse } from '@/types/contentful'

const QUERY_POST = gql`
  query blogPost($slug: String) {
    blogPostCollection(where: { slug: $slug }) {
      items {
        sys {
          publishedAt
        }
        title
        slug
        author {
          name
        }
        publishDate
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

const PostDetails = () => {
  const { slug } = useLocalSearchParams()

  const { data, loading } = useQuery<BlogPostQueryResponse, OperationVariables>(
    QUERY_POST,
    {
      fetchPolicy: 'no-cache',
      variables: { slug },
    },
  )
  const post = data ? data.blogPostCollection?.items[0] : null

  if (loading) {
    return null
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {post?.heroImage && (
          <Image style={styles.hero} source={{ uri: post.heroImage.url }} />
        )}
        <Text style={styles.menu}>On the astrological menu:</Text>
        <Transits transits={post?.transitCollection.items} />
        <Markdown style={markdownStyles}>{post?.body}</Markdown>
      </View>
    </ScrollView>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
