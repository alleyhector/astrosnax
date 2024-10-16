import { Dimensions, Platform } from 'react-native'

export const dropShadow = {
  shadowColor:
    Platform.OS == 'android' ? 'rgb(0, 0, 0)' : 'rgba(42, 42, 43, 0.2)',
  shadowOffset: {
    width: -4,
    height: 4,
  },
  shadowRadius: 10,
  shadowOpacity: 1,
  elevation: 8,
}

export const textShadow = {
  textShadowColor: 'rgba(42, 42, 43, 0.2)',
  textShadowOffset: {
    width: -4,
    height: 4,
  },
  textShadowRadius: 5,
  elevation: 8,
}

export const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
}

export const card = {
  backgroundColor: '#f2ead8',
  marginVertical: 15,
  padding: 15,
  borderRadius: 10,
  ...dropShadow,
}

export const markdownStyles = {
  h1: { fontFamily: 'AngelClub', fontSize: 24 },
  h2: { fontFamily: 'AngelClub', fontSize: 22 },
  h3: { fontFamily: 'AngelClub', fontSize: 20 },
  strong: { fontFamily: 'AngelClub', fontSize: 18 },
  paragraph: { fontFamily: 'Nimbus', fontsize: 16 },
}
