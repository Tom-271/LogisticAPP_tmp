import Loader from '@/app/components/Loader/Loader';

export default function Loading() {
  return (
    // Utilizzo le classi Tailwind per centrare il loader a schermo intero
    <div className="flex h-screen w-full items-center justify-center">
      <Loader />
    </div>
  );
}