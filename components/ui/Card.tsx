import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { ExternalLink } from '../ExternalLink'
import {
  apiImage,
  apiImageWrapper,
  apiTextContainer,
  apiTitle,
  row,
} from '@/constants/Styles'

interface CardProps {
  id: string
  background: any
  imageUrl: string
  name: string
  owner: string
  description: string
  link: string
  backgroundColor?: string
}

const Card: React.FC<CardProps> = ({
  id,
  background,
  imageUrl,
  name,
  owner,
  description,
  link,
}) => {
  return (
    <ExternalLink key={id} href={link}>
      <View style={[row, background]}>
        <View style={apiImageWrapper}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              alt={`Image for ${name} playlist`}
              style={[apiImage, background]}
            />
          )}
        </View>
        <View style={[apiTextContainer, background]}>
          <View style={background}>
            <Text style={apiTitle}>
              {name} by {owner}
            </Text>
            <Text>{description}</Text>
          </View>
        </View>
      </View>
    </ExternalLink>
  )
}

export default Card
