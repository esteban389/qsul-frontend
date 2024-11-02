import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-between">
      <section className="mx-4 flex-auto rounded-lg bg-gray-100/75 p-8 text-gray-800 shadow-md md:basis-1/3 md:py-4">
        <h1>Iniciar sesión</h1>
        <h2>Escribe tu correo y contraseña para ingresar</h2>
      </section>
      <section className="fixed inset-0 -z-10 flex-auto bg-gray-100 blur-[6px] md:static md:basis-3/4 md:blur-0">
        <Image
          className="size-full object-cover md:object-contain"
          src="/login-people.png"
          width={500}
          height={500}
          alt="Personas mirando una pantalla"
        />
      </section>
    </main>
  );
}
