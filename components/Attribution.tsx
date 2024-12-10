import { Linking, TouchableOpacity } from 'react-native'
import { Text, View } from './Themed'
import { Image } from 'react-native'
import { column } from '@/constants/Styles'

const Attribution = () => {
  return (
    <View style={column}>
      <Text>Recipe data: </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://developer.edamam.com/')}
      >
        <Image
          source={{
            uri: 'https://developer.edamam.com/images/transparent.png',
          }}
          style={{ width: 200, height: 40 }}
          alt='Edamam logo'
        />
      </TouchableOpacity>
    </View>
  )
}

export default Attribution
