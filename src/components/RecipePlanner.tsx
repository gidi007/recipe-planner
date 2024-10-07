"use client"
import { useState } from "react"
import { Plus, Search, Calendar, ShoppingCart, Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data for recipes
const mockRecipes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    ingredients: ["spaghetti", "eggs", "bacon", "parmesan cheese", "black pepper"],
    instructions: "1. Cook spaghetti. 2. Fry bacon. 3. Mix eggs and cheese. 4. Combine all ingredients.",
    nutrition: { calories: 600, protein: 25, carbs: 70, fat: 30 }
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    ingredients: ["chicken breast", "mixed vegetables", "soy sauce", "garlic", "ginger"],
    instructions: "1. Cut chicken and vegetables. 2. Stir fry chicken. 3. Add vegetables and sauce. 4. Cook until done.",
    nutrition: { calories: 400, protein: 35, carbs: 20, fat: 15 }
  },
  {
    id: 3,
    name: "Vegetable Soup",
    ingredients: ["carrots", "celery", "onions", "potatoes", "vegetable broth"],
    instructions: "1. Chop vegetables. 2. Sauté onions. 3. Add other vegetables and broth. 4. Simmer until vegetables are tender.",
    nutrition: { calories: 200, protein: 5, carbs: 40, fat: 2 }
  }
]

export function RecipePlannerComponent() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [newIngredient, setNewIngredient] = useState("")
  const [suggestedRecipes, setSuggestedRecipes] = useState<typeof mockRecipes>([])
  const [mealPlan, setMealPlan] = useState<{ [key: string]: number }>({})
  const [shoppingList, setShoppingList] = useState<string[]>([])
  const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([])

  const addIngredient = () => {
    if (newIngredient && !ingredients.includes(newIngredient)) {
      setIngredients([...ingredients, newIngredient])
      setNewIngredient("")
    }
  }

  const findRecipes = () => {
    const suggestions = mockRecipes.filter(recipe =>
      ingredients.some(ingredient => recipe.ingredients.includes(ingredient))
    )
    setSuggestedRecipes(suggestions)
  }

  const addToMealPlan = (recipeId: number, day: string) => {
    setMealPlan({ ...mealPlan, [day]: recipeId })
  }

  const addToShoppingList = (ingredients: string[]) => {
    setShoppingList([...new Set([...shoppingList, ...ingredients])])
  }

  const toggleFavorite = (recipeId: number) => {
    setFavoriteRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Finder and Meal Planner</h1>

      <Tabs defaultValue="finder" className="space-y-4">
        <TabsList>
          <TabsTrigger value="finder">Recipe Finder</TabsTrigger>
          <TabsTrigger value="planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="shopping">Shopping List</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="finder">
          <Card>
            <CardHeader>
              <CardTitle>Find Recipes</CardTitle>
              <CardDescription>Enter ingredients you have on hand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Enter an ingredient"
                />
                <Button onClick={addIngredient}>
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map((ingredient, index) => (
                  <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded">
                    {ingredient}
                  </span>
                ))}
              </div>
              <Button onClick={findRecipes}>
                <Search className="mr-2 h-4 w-4" /> Find Recipes
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4 mt-4">
            {suggestedRecipes.map((recipe) => (
              <Card key={recipe.id}>
                <CardHeader>
                  <CardTitle>{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                  <p><strong>Instructions:</strong> {recipe.instructions}</p>
                  <p><strong>Nutrition:</strong> Calories: {recipe.nutrition.calories}, Protein: {recipe.nutrition.protein}g, Carbs: {recipe.nutrition.carbs}g, Fat: {recipe.nutrition.fat}g</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => addToMealPlan(recipe.id, "Monday")}>
                    <Calendar className="mr-2 h-4 w-4" /> Add to Meal Plan
                  </Button>
                  <Button variant="outline" onClick={() => addToShoppingList(recipe.ingredients)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Shopping List
                  </Button>
                  <Button variant="outline" onClick={() => toggleFavorite(recipe.id)}>
                    <Heart className="mr-2 h-4 w-4" fill={favoriteRecipes.includes(recipe.id) ? "currentColor" : "none"} /> Favorite
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="planner">
          <Card>
            <CardHeader>
              <CardTitle>Meal Planner</CardTitle>
              <CardDescription>Plan your meals for the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <Label>{day}</Label>
                    <Select value={mealPlan[day]?.toString()} onValueChange={(value) => addToMealPlan(Number(value), day)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a meal" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRecipes.map((recipe) => (
                          <SelectItem key={recipe.id} value={recipe.id.toString()}>{recipe.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping">
          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>Items you need to buy</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <ul className="space-y-2">
                  {shoppingList.map((item, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{item}</span>
                      <Button variant="ghost" size="sm" onClick={() => setShoppingList(shoppingList.filter((_, i) => i !== index))}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShoppingList([])}>Clear List</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Recipes</CardTitle>
              <CardDescription>Your saved recipes</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {mockRecipes.filter(recipe => favoriteRecipes.includes(recipe.id)).map((recipe) => (
                  <Card key={recipe.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{recipe.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                      <p><strong>Instructions:</strong> {recipe.instructions}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => toggleFavorite(recipe.id)}>
                        <Heart className="mr-2 h-4 w-4" fill="currentColor" /> Remove from Favorites
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
export default RecipePlannerComponent();