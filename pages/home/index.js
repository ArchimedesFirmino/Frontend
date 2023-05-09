$(document).ready(myHome)

/**
 * IMPORTANTE!
 * URL para obter todos os artigos ordenados pela data e com status ativo:
 * http://localhost:3000/articles?_sort=date&_order=desc&status=on
 * \---------+---------/
 *           |
 *           +--> URL da API → variável 'app.apiBaseURL' em '/index.js'
 **/

/**
 * Função principal da página "home".
 **/
function myHome() {
    //Muda o título da página na aba.
    changeTitle()
    //Cria uma variável vazia para receber a lista de artigos armazenados em "articles".
    var articleList = '';
    //Faz um método GET para recolher todos os artigos ordenados pela data, em ordem decrescente e com status "on".
    $.get(app.apiBaseURL + 'articles', {
        _sort: 'date',
        _order: 'desc',
        status: 'on'
    })
        //Armazena os artigos coletados em "data"
        .done((data) => {
            //Para cada artigo armazenado...
            data.forEach((art) => {
                //Adiciona os dados do artigo selecionado a uma estrutura html dentro da variável criada acima.
                articleList += `
                    <div class="art-item" data-id="${art.id}">
                        <img src="${art.thumbnail}" alt="${art.title}">
                        <div>
                            <h3>${art.title}</h3>
                            <p>${art.resume}</p>
                        </div>
                    </div>                    
                `
            })
            // Armazena a varíavel com os artigos estruturados dentro da div com o id artList no html de home.
            $('#artList').html(articleList)
        })
        //Caso a requisição falhe, gera mensagem de erro.
        .fail((error) => {
            $('#artList').html('<p class="center">Oooops! Não encontramos nenhum artigo...</p>')
        })

}
