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

// Função que exibe artigos mais visualizados na página home.
function getMostViewed(limit) {
    var htmlOut = ''
    // Método GET que recolhe os artigos com visualizações em ordem decrescente e status "on".
    $.get(app.apiBaseURL + 'articles', {
        status: 'on',
        _sort: 'views',
        _order: 'desc',
        _limit: limit || 5
    })
        .done((data) => {

            // Caso encontre um ou mais artigos...
            if (data.length > 0) {
                // Adiciona os artigos em uma lista não ordenada (ul).
                htmlOut = '<ul>'
                // Para cada artigo, adiciona um (li) com seu id e seu título.
                data.forEach((item) => {
                    htmlOut += `<li class="article" data-id="${item.id}">${item.title}</li>`
                })
                // Fecha com o (/ul).
                htmlOut += '</ul>'
            } else {
                // Caso não encontre artigos, exibe a mensagem.
                htmlOut = '<p class="center">Nenhum artigo encontrado.</p>'
            }
            // Adiciona os artigos armazenados na variável htmlOut para o HTML.
            $('#mostVisited').html(htmlOut)
        })
        // Caso não consiga adicionar os artigos no HTML, exibe a mensagem.
        .fail((error) => {
            $('#mostVisited').html('<p class="center">Nenhum artigo encontrado.</p>')
        })

}
// Função que exibe os últimos comentários.
function getLastComments(limit) {

    var htmlOut = ''
    // Método GET que recolhe os comentários com status "on" e com ordem decrescente baseada na data.
    $.get(app.apiBaseURL + 'comments', {
        status: 'on',
        _sort: 'date',
        _order: 'desc',
        _limit: limit || 5
    })
        .done((data) => {
            if (data.length > 0) {
                htmlOut = '<ul>'
                data.forEach((item) => {
                    htmlOut += `<li class="article" data-id="${item.article}">${item.content.truncate(45)}</li>`
                })
                htmlOut += '</ul>'
            } else {
                htmlOut = '<p class="center">Nenhum comentário ainda.</p>'
            }

            $('#lastComments').html(htmlOut)
        })
        .fail((error) => {
            $('#lastComments').html('<p class="center">Nenhum comentário ainda.</p>')
        })

}