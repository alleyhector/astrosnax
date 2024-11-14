import { Image, StyleSheet, ScrollView } from 'react-native'
import { View } from '@/components/Themed'
import { gql, OperationVariables, useQuery } from '@apollo/client'
import Markdown from 'react-native-markdown-display'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AboutCollectionQueryResponse } from '@/types/contentful'
import { container } from '@/constants/Styles'

const QUERY_ABOUT = gql`
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

const AboutScreen = () => {
  const insets = useSafeAreaInsets()
  const { data } = useQuery<AboutCollectionQueryResponse, OperationVariables>(
    QUERY_ABOUT,
    {
      fetchPolicy: 'no-cache',
    },
  )

  const about = data?.aboutCollection?.items[0]

  return (
    <ScrollView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        display: 'flex',
      }}
    >
      <View style={container}>
        {about && (
          <>
            {about.profile && (
              <Image style={styles.hero} source={{ uri: about.profile.url }} />
            )}
            <Markdown style={styles}>{about.aboutMe}</Markdown>
          </>
        )}
      </View>
    </ScrollView>
  )
}

export default AboutScreen

const styles = StyleSheet.create({
  hero: {
    marginTop: 20,
    width: 260,
    height: 387,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
