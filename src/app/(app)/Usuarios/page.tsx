export const runtime = 'edge';

function HomePage() {
  return (
    <main className="mx-4 flex h-screen flex-col items-center justify-center lg:mx-auto lg:w-1/2">
      <h1 className="w-full text-center text-2xl font-bold">Bienvenido</h1>
      <h2 className="text-center text-primary/60">
        No te preocupes, solo ingresa tu correo electrónico y te enviaremos un
        enlace para reestablcecer tu contraseña si encontramos tu cuenta
      </h2>
    </main>
  );
}
export default HomePage;
