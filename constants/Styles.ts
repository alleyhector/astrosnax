import {
  Dimensions,
  ImageStyle,
  Platform,
  TextStyle,
  ViewStyle,
} from 'react-native'

const dropShadow = {
  shadowColor:
    Platform.OS === 'android' ? 'rgb(0, 0, 0)' : 'rgba(42, 42, 43, 0.2)',
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

export const borderRadius = {
  borderRadius: 10,
}

export const card = {
  marginVertical: 15,
  padding: 15,
  ...borderRadius,
  ...dropShadow,
}

export const backgroundColor = { backgroundColor: '#d2c4b2' }
export const backgroundColorVar1 = { backgroundColor: '#fff' }
export const backgroundColorVar2 = { backgroundColor: '#8e9d46' }

export const container = {
  flex: 1,
  fontFamily: 'Nimbus',
  padding: 20,
  paddingBottom: 30,
}

export const column: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

export const row: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  margin: 10,
}

export const apiImage: ImageStyle = {
  width: 100,
  height: 100,
  resizeMode: 'contain',
  alignSelf: 'center',
}

export const apiTextContainer = {
  flex: 1,
  padding: 10,
  marginTop: 5,
  marginBottom: 15,
  fontFamily: 'NimbusBold',
  textAlign: 'center',
}

export const apiTitle: TextStyle = {
  marginTop: 5,
  marginBottom: 15,
  fontFamily: 'NimbusBold',
  fontSize: 16,
  textAlign: 'left',
}

export const markdownStyles = {
  h1: { fontFamily: 'AngelClub', fontSize: 24 },
  h2: { fontFamily: 'AngelClub', fontSize: 22 },
  h3: { fontFamily: 'AngelClub', fontSize: 20 },
  strong: { fontFamily: 'AngelClub', fontSize: 18 },
  paragraph: { fontFamily: 'Nimbus', fontsize: 16 },
}
