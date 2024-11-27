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

export const container = {
  flex: 1,
  fontFamily: 'Nimbus',
  padding: 20,
  paddingBottom: 30,
  backgroundColor: 'transparent',
}

export const column: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
}

export const row: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  margin: 10,
  paddingBottom: 10,
}

export const apiImage: ImageStyle = {
  width: 100,
  height: 100,
  resizeMode: 'cover',
  alignSelf: 'center',
  borderLeftWidth: 3,
  borderTopWidth: 3,
}

export const apiTextContainer = {
  flex: 1,
  paddingLeft: 10,
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
  flexWrap: 'wrap',
}
