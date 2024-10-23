import { Image, StyleSheet, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { gql, useQuery } from '@apollo/client'
import Markdown from 'react-native-markdown-display'
import { Text, View, useThemeColor } from '@/components/Themed'
import Transits from '@/components/Transits'
import { markdownStyles } from '@/constants/Styles'

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

  const { data, loading, refetch } = useQuery(QUERY_POST, {
    fetchPolicy: 'no-cache',
    variables: { slug },
  })
  const post = data?.blogPostCollection?.items[0]

  return (
    <ScrollView>
      {!loading && (
        <View style={styles.container}>
          {post.heroImage && (
            <Image style={styles.hero} source={{ uri: post.heroImage.url }} />
          )}
          <Text style={styles.menu}>On the astrological menu:</Text>
          <Transits transits={post.transitCollection.items} />
          <Markdown style={markdownStyles}>{post?.body}</Markdown>
        </View>
      )}
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
