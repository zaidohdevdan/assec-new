import * as React from "react";

const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-primary focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2"
    >
      Pular para o conteúdo principal
    </a>
  );
};

export default SkipLink;
