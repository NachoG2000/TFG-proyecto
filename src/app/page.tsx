import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Brain, ChartBar, Gamepad2, Users, BookOpen, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

export const metadata = {
  title: 'AI-EDU: Revolucionando el Aprendizaje con IA y Gamificación',
  description: 'Sistema educativo innovador que personaliza el aprendizaje, optimiza la evaluación y aumenta la motivación de los estudiantes mediante IA Generativa y gamificación.',
  openGraph: {
    title: 'AI-EDU: Revolucionando el Aprendizaje con IA y Gamificación',
    description: 'Sistema educativo innovador que personaliza el aprendizaje, optimiza la evaluación y aumenta la motivación de los estudiantes mediante IA Generativa y gamificación.',
    images: [{ url: '/og-image.jpg' }],
  },
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link className="flex items-center space-x-2" href="/">
              <Brain className="h-6 w-6" />
              <span className="font-bold sm:inline-block">AI-EDU</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="#caracteristicas">Características</Link>
              <Link href="#beneficios">Beneficios</Link>
              <Link href="#contacto">Contacto</Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden md:inline-flex">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button className="hidden md:inline-flex">Registrarse</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Revoluciona la Educación con IA y Gamificación
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Personaliza el aprendizaje, optimiza la evaluación y aumenta la motivación de los estudiantes con nuestro innovador sistema educativo AI-EDU.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="#contacto"
                >
                  Empieza Ahora
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="#caracteristicas"
                >
                  Aprende Más
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="caracteristicas" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Características Principales</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Brain className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">IA Generativa</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Personaliza el contenido y las estrategias de aprendizaje para cada estudiante.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Gamepad2 className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Gamificación</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Aumenta la motivación y participación mediante elementos de juego.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <ChartBar className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Análisis Avanzado</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Monitorea y evalúa el progreso de los estudiantes con precisión.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="beneficios" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Beneficios</h2>
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="flex items-start space-x-4">
                <BookOpen className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Aprendizaje Personalizado</h3>
                  <p className="text-gray-500 dark:text-gray-400">Adapta el contenido y el ritmo a las necesidades individuales de cada estudiante.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Mayor Engagement</h3>
                  <p className="text-gray-500 dark:text-gray-400">Aumenta la participación y motivación de los estudiantes mediante técnicas de gamificación.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <ChartBar className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Evaluación Optimizada</h3>
                  <p className="text-gray-500 dark:text-gray-400">Proporciona evaluaciones precisas y en tiempo real del rendimiento académico.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Brain className="mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold">Automatización Inteligente</h3>
                  <p className="text-gray-500 dark:text-gray-400">Libera tiempo de los docentes automatizando tareas pedagógicas rutinarias.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="contacto" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Listo para Revolucionar la Educación?</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Únete a la vanguardia de la educación con AI-EDU. Contacta con nosotros para una demostración o más información.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-lg flex-1"
                    placeholder="Ingresa tu email"
                    type="email"
                  />
                  <Button type="submit" className="w-full sm:w-auto">Suscribirse</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 AI-EDU. Todos los derechos reservados.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Términos de Servicio
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}