
const api  = axios.create({
    baseURL:"https://api.portalmec.c3sl.ufpr.br/v1/learning_objects"
});

const table = document.querySelector("#table");
const pageNumber = document.querySelector(".pageNumber");
const detailsPage = document.querySelector(".details");

async function getReds(page) {
    try {
      const response = await api.get(`?limit=15&offset=${(page)*15}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

async function getRed(id) {
    try {
      const response = await api.get(`/${id}`);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

function changeItens(number){
  let start =parseInt( location.search.substring(location.search.indexOf("=")+1));
  
    if(start+number > 0){
      start+=number;
      document.location = `index.html?page=${start}`
    }

}

function uptadeItens(){
  let page = location.search.substring(location.search.indexOf("=")+1);
  if(location.search.substring(location.search.indexOf("?"),location.search.indexOf("=")) != "?page"){
    document.location = `index.html?page=${1}`
  }else{
    buildCatalogPage(page);
  }
}


function buildCatalogPage(page){
  table.innerHTML = "<div>Carregando...</div>";
  table.classList.add("loading");
  
  pageNumber.innerHTML = `<p>${page}</p>`;
  let html = "";

  getReds(page).then((valor) =>{
    table.classList.remove("loading");
    table.innerHTML = "<div></div>";
    valor.data.forEach(element => {
        const item = document.createElement("div");
        item.classList.add("item");
        html = `
          <h1 class="redName">${element.name}</h1>
          <h2 class = "author">Autores: ${element.author}</h2>
          <h2>Categoria: ${element.object_type}</h2>
          <div class="link">
            <a target="_blank" href="${element.link}">Acesse aqui para ver o projeto</a>
          </div>
          <h2 class="title">Palavras Chaves:</h2>
        `;
        html+=`<div class="tags">`;
        element.tags.forEach(tag=>{
          html += `<h3>${tag.name}</h3>`
        });
        html +=`</div>`;
        html += `
          <h4>${element.description}</h4>
          <a href="pages/details.html?item=${element.id}&page=${location.search.substring(location.search.indexOf("=")+1)}">Ver mais informações</a>
          <div class="line"></div>
        `;
        item.innerHTML = html;
        
        table.appendChild(item); 
    });

});
}

// function openDetailsPage(data){
//   //let detailItem = data;
//   //let page = location.search.substring(location.search.indexOf("=")+1);
//   document.location = `pages/details.html?item=${detailItem}&page=${page}`;
// }


function loadDetailsPage(){
  const id = location.search.substring(6, location.search.indexOf("&"));
  getRed(id).then(element=>{
    buildDetailsPage(element.data);
  })
  
}

function buildDetailsPage(data){
  let html = "";
  html = `
    <h1 class="redName">${data.name}</h1>
    <h2 class = "author">Autores: ${data.author}</h2>
    <h2>Categoria: ${data.object_type}</h2>
    <h2>Data de publicação: ${data.created_at.substring(0,data.created_at.indexOf("T"))}</h2>
    <div class="link">
      <a target="_blank" href="${data.link}">Acesse aqui para ver o projeto</a>
    </div>
  `;
  html += `
    <h4>${data.description}</h4>
    <div class="line"></div>
    <h2 class="title">Assuntos:</h2>
  `;
  html+=`<div class="tags">`;
  data.subjects.forEach(subject=>{
      html += `<h3>${subject.name}</h3>`
    });
  
  html +=`</div>`;
  html+=`
  <h2 class="title">Palavras Chaves:</h2>
  <div class="tags">`;
  data.tags.forEach(tag=>{
      html += `<h3>${tag.name}</h3>`
    });

  html +=`</div>`;
  html+=`<h2>Visualizações: ${data.views_count}</h2>`
  html+=`<h2>Nota das Reviews: ${data.review_average.toFixed(2)}</h2>`
  
  html +=`
  <div class="link">
  <a class="voltar" href="../index.html?page=${location.search.substring(location.search.indexOf("page")+5)}">Voltar</a>
  </div>`


  detailsPage.innerHTML = html;

}

function returnIndexPage(){
  document.location = `../index.html?page=${location.search.substring(location.search.indexOf("page")+5)}`;
}



if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}

