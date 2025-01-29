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
  background: any
  imageUrl: string
  alt: string
  owner: string
  description: string
  link: string
  backgroundColor?: string
}

const Card: React.FC<CardProps> = ({
  background,
  imageUrl,
  alt,
  owner,
  description,
  link,
}) => {
  return (
    <ExternalLink href={link}>
      <View style={[row, background]}>
        <View style={apiImageWrapper}>
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              alt={alt}
              style={[apiImage, background]}
            />
          )}
        </View>
        <View style={[apiTextContainer, background]}>
          <View style={background}>
            <Text style={apiTitle}>{owner}</Text>
            <Text>{description}</Text>
          </View>
        </View>
      </View>
    </ExternalLink>
  )
}

export default Card
