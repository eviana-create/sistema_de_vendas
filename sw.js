// sw.js
const CACHE_NAME = "adega-v1";
const urlsToCache = [
  "/sistema_de_vendas/",
  "/sistema_de_vendas/login.html",
  "/sistema_de_vendas/admin.html",
  "/sistema_de_vendas/funcionario.html",
  "/sistema_de_vendas/cadastro.html",
  "/sistema_de_vendas/estoque.html",
  "/sistema_de_vendas/vendas.html",
  "/sistema_de_vendas/historico.html",
  "/sistema_de_vendas/css/style.css",
  "/sistema_de_vendas/js/firebaseConfig.js"
  // Adicione mais se necessário
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});
