export interface Nutrition {
  /** ккал на порцию */
  kcal: number
  /** белки, г */
  protein: number
  /** жиры, г */
  fat: number
  /** углеводы, г */
  carbs: number
  /** размер порции, например «250 мл» или «95 г» */
  serving: string
}

export interface Recipe {
  ingredients: string[]
  steps: string[]
}

export type Category = 'drink' | 'pastry'

export interface MenuItem {
  id: string
  category: Category
  name: string
  tagline: string
  description: string
  emoji: string
  /** пара цветов для градиентной «тарелки» карточки */
  gradient: [string, string]
  price: number
  recipe: Recipe
  nutrition: Nutrition
  popular?: boolean
}
