import { FC, memo } from 'react'
import { StyleSheet, FlatList, ListRenderItem } from 'react-native'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import { View } from '@/components/Themed'
import { Link } from 'expo-router'
import Transits from '@/components/Transits'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BlogPost, BlogPostQueryResponse } from '@/types/contentful'
import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'
import { DefaultTheme } from '@react-navigation/native'

const QUERY_POSTS = gql`
  query blogPosts($today: DateTime!) {
    blogPostCollection(
      where: { sys: { publishedAt_lte: $today } }
      order: sys_publishedAt_DESC
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
        publishDate
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

const ArchiveScreen: FC = () => {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const today = new Date().toString()

  const { data } = useQuery<BlogPostQueryResponse, OperationVariables>(
    QUERY_POSTS,
    {
      fetchPolicy: 'no-cache',
      variables: { today: new Date(today) },
    },
  )

  const posts = data?.blogPostCollection.items

  const keyExtractor = (item: BlogPost, index: number) => index.toString()
  const renderItem: ListRenderItem<BlogPost> = ({ item }) => (
    <Item item={item} />
  )

  const Item: FC<{ item: BlogPost }> = memo(({ item }) => (
    <View style={styles.container}>
      <Link href={`/${item.slug}`} style={styles.title}>
        {item.title}
      </Link>
      <Transits transits={item.transitCollection.items} />
    </View>
  ))
  Item.displayName = 'BlogPostItem'

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        display: 'flex',
        backgroundColor: colorScheme
          ? Colors[colorScheme].background
          : DefaultTheme.colors.background,
      }}
    >
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

export default ArchiveScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'Nimbus',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'AngelClub',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
