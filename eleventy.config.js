// Configuración técnica del sitio. NO es necesario editar este archivo
// para cambiar textos, productos, precios u horarios: eso está en src/_data/
import fs from "node:fs";
import path from "node:path";

const escapar = (texto) =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const vacio = (valor) =>
  valor === undefined ||
  valor === null ||
  (typeof valor === "string" && valor.trim() === "") ||
  (Array.isArray(valor) && valor.length === 0);

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });

  // ¿Está vacío este dato? (texto vacío o lista vacía)
  eleventyConfig.addFilter("vacio", vacio);

  // Muestra el dato o, si falta, un aviso [PENDIENTE: ...] visible.
  eleventyConfig.addShortcode("pend", (valor, descripcion) =>
    vacio(valor)
      ? `<span class="pendiente">[PENDIENTE: ${escapar(descripcion)}]</span>`
      : escapar(valor)
  );

  // Foto: si el archivo existe en src/img/ se muestra; si no, aparece un
  // recuadro "FOTO PENDIENTE" con el nombre exacto del archivo que falta.
  eleventyConfig.addShortcode("foto", (archivo, alt, clase = "", carga = "lazy") => {
    const ruta = archivo ? path.join("src/img", archivo) : null;
    if (ruta && fs.existsSync(ruta)) {
      return `<img class="${escapar(clase)}" src="/img/${escapar(archivo)}" alt="${escapar(alt || "")}" loading="${carga}" decoding="async">`;
    }
    return `<span class="foto-pendiente ${escapar(clase)}" role="img" aria-label="Foto pendiente: ${escapar(alt || archivo || "")}"><span>FOTO PENDIENTE</span><code>src/img/${escapar(archivo || "(sin nombre)")}</code></span>`;
  });

  // Logo: igual que la foto, pero el recuadro dice "LOGO PENDIENTE".
  eleventyConfig.addShortcode("logo", (archivo, nombreMarca, clase = "") => {
    const ruta = archivo ? path.join("src/img", archivo) : null;
    if (ruta && fs.existsSync(ruta)) {
      return `<img class="${escapar(clase)}" src="/img/${escapar(archivo)}" alt="${escapar(nombreMarca)}" decoding="async">`;
    }
    return `<span class="logo-pendiente ${escapar(clase)}"><span class="logo-pendiente__nombre">${escapar(nombreMarca)}</span><small>LOGO PENDIENTE</small></span>`;
  });

  // Convierte un número de WhatsApp ("+56 9 1234 5678") en un enlace wa.me.
  eleventyConfig.addFilter("whatsapp", (numero) =>
    `https://wa.me/${String(numero).replace(/\D/g, "")}`
  );

  // Convierte un usuario de Instagram ("@lakaffe") en su enlace.
  eleventyConfig.addFilter("instagram", (usuario) =>
    `https://www.instagram.com/${String(usuario).replace(/^@/, "").trim()}/`
  );

  eleventyConfig.addFilter("anio", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
