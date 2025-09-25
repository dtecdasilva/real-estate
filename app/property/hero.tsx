// components/PropertyHero.tsx
import { Button } from "@/components/ui/button"

export default function PropertyHero() {
  return (
    <section className="relative bg-cover bg-center rounded-xl p-6 mb-6 text-white shadow-lg" 
      style={{ backgroundImage: `url('/your-image.jpg')` }}
    >
      <div className="bg-black/50 p-6 rounded-xl max-w-xl">
        <h2 className="text-2xl font-bold">
          Find Your <span className="text-blue-500">Dream Property</span>
        </h2>
        <p className="mt-2 text-sm">
          Buy, rent, or invest with confidence. Discover curated listings tailored for you.
        </p>
        <Button className="mt-4">Browse Listings</Button>
      </div>
    </section>
  )
}
