import { FC } from 'react'
import { View, Text } from '@/components/Themed'
import { Image } from 'expo-image'
import { ExternalLink as ExternalLinkComponent } from '../ExternalLink'
import {
  apiImage,
  apiImageWrapper,
  apiTextContainer,
  apiTitle,
  row,
} from '@/constants/Styles'
import { memo } from 'react'

interface CardProps {
  background: object
  imageUrl: string
  alt: string
  title: string
  description: string
  link: string
}

const ExternalLink = memo(ExternalLinkComponent)

const Card: FC<CardProps> = ({
  background,
  imageUrl,
  alt,
  title,
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
              placeholder={require('@/assets/images/recipe-placeholder.png')}
              placeholderContentFit='cover'
              transition={1000}
            />
          )}
        </View>
        <View style={[apiTextContainer, background]}>
          <View style={background}>
            <Text style={apiTitle}>{title}</Text>
            <Text>{description}</Text>
          </View>
        </View>
      </View>
    </ExternalLink>
  )
}

export default Card
