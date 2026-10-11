"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};

/**
 * Renderiza su contenido directamente en <body>.
 *
 * Los modales usan `position: fixed`, que se posiciona contra el ancestro
 * más cercano con transform/filter/contain en vez del viewport. Varias
 * secciones del sitio animan con transform (RevealOnScroll, hovers), así
 * que sin el portal el overlay queda recortado dentro de su sección.
 */
export default function ModalPortal({
    children,
}: {
    children: React.ReactNode;
}) {
    /* En el servidor no hay document: no renderizamos nada hasta hidratar */
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    if (!isClient) {
        return null;
    }

    return createPortal(children, document.body);
}
