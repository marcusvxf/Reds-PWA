const site = "Red-site"
const itens = [
  "/",
  "index.html",
  "js/script.js",
  "css/style.css",
  "favicon.ico",
  "favicon.png",
  "apple-touch-icon.png",
  "maskableIcon.png",
  "pages/details.html"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(site).then(cache => {
      cache.addAll(itens)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request,{ignoreSearch: true}).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
