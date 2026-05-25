import { FC } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import { useColorScheme } from '@/components/useColorScheme'
import Colors from '@/constants/Colors'

const MAX_PAGE_BUTTONS = 7
const SIBLING_COUNT = 1

type PageItem = number | 'ellipsis'

/** Visible page numbers with ellipses when totalPages exceeds MAX_PAGE_BUTTONS. */
export function getVisiblePages(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  if (totalPages <= 0) return []
  if (totalPages <= MAX_PAGE_BUTTONS) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const items: PageItem[] = [1]
  const start = Math.max(2, currentPage - SIBLING_COUNT)
  const end = Math.min(totalPages - 1, currentPage + SIBLING_COUNT)

  if (start > 2) items.push('ellipsis')
  for (let page = start; page <= end; page++) items.push(page)
  if (end < totalPages - 1) items.push('ellipsis')
  items.push(totalPages)

  return items
}

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
  const visiblePages = getVisiblePages(currentPage, totalPages)

  const activeBackground =
    colorScheme === 'dark' ? '#000' : '#fac7b0'

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
        {visiblePages.map((item, index) =>
          item === 'ellipsis' ? (
            <View
              key={`ellipsis-${index}`}
              style={[styles.paginationButton, styles.ellipsis]}
            >
              <Text style={styles.paginationText}>…</Text>
            </View>
          ) : (
            <Pressable
              key={item}
              onPress={() => goToPage(item)}
              style={({ pressed }) => [
                styles.paginationButton,
                {
                  color: Colors[colorScheme].text,
                  backgroundColor:
                    currentPage === item
                      ? activeBackground
                      : Colors[colorScheme].background,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={styles.paginationText}>{`${item}`}</Text>
            </Pressable>
          ),
        )}
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
  ellipsis: {
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
  paginationText: { fontFamily: 'AngelClub', fontSize: 18 },
})

export default Pagination
