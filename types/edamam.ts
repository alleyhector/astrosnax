export interface RecipeProps {
  query: string
  cuisineType?: string
}

export interface RecipeSearchResponse {
  from: number
  to: number
  count: number
  _links: {
    self: {
      href: string
      title: string
    }
    next?: {
      href: string
      title: string
    }
  }
  recipe: Recipe
}

export interface Recipe {
  uri: string
  label: string
  image: string
  images: {
    THUMBNAIL: {
      url: string
      width: number
      height: number
    }
    SMALL: {
      url: string
      width: number
      height: number
    }
    REGULAR: {
      url: string
      width: number
      height: number
    }
  }
  source: string
  url: string
  shareAs: string
  yield: number
  dietLabels: string[]
  healthLabels: string[]
  cautions: string[]
  ingredientLines: string[]
  ingredients: {
    text: string
    weight: number
    foodCategory: string
    foodId: string
    image?: string
  }[]
  calories: number
  totalWeight: number
  cuisineType: string[]
  mealType: string[]
  dishType: string[]
  totalNutrients: Record<string, Nutrient>
  totalDaily: Record<string, Nutrient>
  digest: {
    label: string
    tag: string
    schemaOrgTag?: string
    total: number
    hasRDI: boolean
    daily: number
    unit: string
    sub?: {
      label: string
      tag: string
      schemaOrgTag?: string
      total: number
      hasRDI: boolean
      daily: number
      unit: string
    }[]
  }[]
}

export interface Nutrient {
  label: string
  quantity: number
  unit: string
}
