import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 bg-bg-page">
      <h1 className="font-serif font-bold text-4xl sm:text-5xl text-primary mb-4">
        404 - Página Não Encontrada
      </h1>
      <p className="text-text-secondary text-lg max-w-md mb-8">
        Desculpe, o conteúdo que você está procurando não existe ou foi movido.
      </p>
      <Link href="/">
        <Button variant="primary">Voltar para o Início</Button>
      </Link>
    </div>
  );
}
