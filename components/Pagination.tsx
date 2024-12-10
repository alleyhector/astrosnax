import React, { FC } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'

interface PaginationProps {
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  goToPage,
  goToNextPage,
  goToPreviousPage,
}) => {
  const colorScheme = useColorScheme() ?? 'light'

  return (
    <View style={styles.paginationContainer}>
      <View style={styles.paginationButtons}>
        <Pressable
          onPress={goToPreviousPage}
          disabled={currentPage === 1}
          style={({ pressed }) => [
            styles.paginationButton,
            {
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
              opacity: currentPage === 1 ? 0.5 : pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.paginationText}>Previous</Text>
        </Pressable>
        {Array.from({ length: totalPages }, (_, i) => (
          <Pressable
            key={i}
            onPress={() => goToPage(i + 1)}
            style={({ pressed }) => [
              styles.paginationButton,
              {
                color: Colors[colorScheme].text,
                backgroundColor:
                  currentPage === i + 1
                    ? colorScheme === 'dark'
                      ? '#000'
                      : '#fac7b0'
                    : Colors[colorScheme].background,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={styles.paginationText}>{`${i + 1}`}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
          style={({ pressed }) => [
            styles.paginationButton,
            {
              backgroundColor: Colors[colorScheme].background,
              color: Colors[colorScheme].text,
              opacity: currentPage === totalPages ? 0.5 : pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text style={styles.paginationText}>Next</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  paginationContainer: {
    margin: 20,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  paginationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  paginationButton: {
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  paginationText: { fontFamily: 'AngelClub', fontSize: 18 },
})

export default Pagination
