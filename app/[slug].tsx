import { StyleSheet, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { useLocalSearchParams } from 'expo-router'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import Markdown from 'react-native-markdown-display'
import Transits from '@/components/Transits'
import { Text, View } from '@/components/Themed'
import { BlogPostQueryResponse } from '@/types/contentful'
import { useMarkdownStyles } from '@/components/useMarkdown'
import { LinearGradient } from 'expo-linear-gradient'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'
import { DefaultTheme } from '@react-navigation/native'
import { dimensions } from '@/constants/Styles'

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
          description
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
  const markdownStyles = useMarkdownStyles()
  const colorScheme = useColorScheme()

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
    <LinearGradient
      colors={[
        colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
        colorScheme === 'dark' ? '#000' : '#fac7b0',
      ]}
      start={{ x: 0.5, y: 0.6 }}
      style={{ height: dimensions.fullHeight }}
    >
      <ScrollView>
        <View style={styles.container}>
          {post?.heroImage && (
            <Image
              style={styles.hero}
              source={{ uri: post.heroImage.url }}
              alt={post.heroImage.description}
            />
          )}
          <Text style={styles.menu}>On the astrological menu:</Text>
          <Transits transits={post?.transitCollection.items} />
          {post?.body && (
            <Markdown style={markdownStyles}>{post?.body}</Markdown>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

export default PostDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
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
