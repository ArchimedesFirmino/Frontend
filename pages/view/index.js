$(document).ready(myView)

function myView() {
    //Armazena o id do artigo selecionado na página home em uma constante.
    const articleId = parseInt(sessionStorage.article)
    //Se o id não for um número (NaN), direciona para a página 404.
    if (isNaN(articleId)) loadpage('e404')  
    //Captura o artigo na API "articles" pelo seu id e com status "on".
    $.get(app.apiBaseURL + 'articles', { id: articleId, status: 'on' })
        .done((data) => {
            //Se o resultado encontrar mais de um artigo com o mesmo id, carrega a página 404.
            if (data.length != 1) loadpage('e404')
            //Direciona o primeiro valor de data para artData, pois a ordenação de array é a partir do número 0.
            artData = data[0]
            //Substitui os dados obtidos para o html.
            $('#artTitle').html(artData.title)
            $('#artContent').html(artData.content)
            //Função que contabiliza visualizações do artigo.
            updateViews(artData)
            //Muda o titulo da aba para o titulo do artigo.
            changeTitle(artData.title)
            getAuthorDate(artData)
            //Adiciona os outros artigos do mesmo autor, com limite de 5.
            getAuthorArticles(artData, 5)
            //Adiciona formulário para comentar.
            getUserCommentForm(artData)
            //Recebe os comentários do artigo.
            getArticleComments(artData, 999)
        })
        .fail((error) => {
            popUp({ type: 'error', text: 'Artigo não encontrado!' })
            loadpage('e404')
        })

}
//Realiza um GET utilizando os dados extraídos do artigo selecionado.
function getAuthorDate(artData) {
    //Pega os dados do autor através do id.
    $.get(app.apiBaseURL + 'users/' + artData.author)
        .done((userData) => {
            //Pega os dados obtidos e insere na main.
            $('#artMetadata').html(`<span>Por ${userData.name}</span><span>em ${myDate.sysToBr(artData.date)}.</span>`)
            //Pega os dados obtidos e insere no aside.
            $('#artAuthor').html(`
            <img src="${userData.photo}" alt="${userData.name}">
            <h3>${userData.name}</h3>
            <h5>${getAge(userData.birth)} anos</h5>
            <p>${userData.bio}</p>
        `)
        })
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })
}
//Adiciona os artigos feitos pelo mesmo autor no aside.
function getAuthorArticles(artData, limit) {

    $.get(app.apiBaseURL + 'articles', {
        author: artData.author,
        status: 'on',
        //o id_ne retira o id do artigo já apresentado na main da lista para que não se repita.
        id_ne: artData.id,
        _limit: limit
    })
        .done((artsData) => {
            //Se o autor tiver mais de 0 artigos...
            if (artsData.length > 0) {
                //Realiza uma lista (ul) com os artigos.
                var output = '<h3><i class="fa-solid fa-plus fa-fw"></i> Artigos</h3><ul>'
                //Randomiza a ordem dos artigos.
                var rndData = artsData.sort(() => Math.random() - 0.5)
                //Para cada artigo, adiciona um (li) com os dados.
                rndData.forEach((artItem) => {
                    output += `<li class="art-item" data-id="${artItem.id}">${artItem.title}</li>`
                });
                //Fecha a lista.
                output += '</ul>'
                //Adiciona ao aside.
                $('#authorArtcicles').html(output)
            }
        })
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}

function getArticleComments(artData, limit) {

    var commentList = ''
    //Realiza um GET para comentários do artigo selecionado.
    $.get(app.apiBaseURL + 'comments', {
        article: artData.id,
        status: 'on',
        _sort: 'date',
        _order: 'desc',
        _limit: limit
    })
        .done((cmtData) => {
            //Se existir pelo menos um comentário...
            if (cmtData.length > 0) {
                cmtData.forEach((cmt) => {
                    //Para cada comentário referente ao artigo, monta uma estrutura.
                    var content = cmt.content.split("\n").join("<br>")
                    commentList += `
                        <div class="cmtBox">
                            <div class="cmtMetadata">
                                <img src="${cmt.photo}" alt="${cmt.name}" referrerpolicy="no-referrer">
                                <div class="cmtMetatexts">
                                    <span>Por ${cmt.name}</span><span>em ${myDate.sysToBr(cmt.date)}.</span>
                                </div>
                            </div>
                            <div class="cmtContent">${content}</div>
                        </div>
                    `
                })
            //Se não existir comentários, retorna uma mensagem.
            } else {
                commentList = '<p class="center">Nenhum comentário!<br>Seja o primeiro a comentar...</p>'
            }
            //Adiciona a condição ao html.
            $('#commentList').html(commentList)
        })
        .fail((error) => {
            console.error(error)
            loadpage('e404')
        })

}

function getUserCommentForm(artData) {

    var cmtForm = ''
    //Utiliza o firebase como condição.
    firebase.auth().onAuthStateChanged((user) => {
        //Se existir um usuário logado pelo firebase...
        if (user) {
            //Formulário para comentar.
            cmtForm = `
                <div class="cmtUser">Comentando como <em>${user.displayName}</em>:</div>
                <form method="post" id="formComment" name="formComment">
                    <textarea name="txtContent" id="txtContent"></textarea>
                    <button type="submit">Enviar</button>
                </form>
            `
            $('#commentForm').html(cmtForm)
            //Envia o comentário.
            $('#formComment').submit((event) => {
                sendComment(event, artData, user)
            })
        } else {
            //Se não existe um usuário logado, exibe mensagem.
            cmtForm = `<p class="center"><a href="login">Logue-se</a> para comentar.</p>`
            $('#commentForm').html(cmtForm)
        }
    })

}

function sendComment(event, artData, userData) {
    //Impede que a página recarregue.
    event.preventDefault()
    //Retira espaçamento entre o texto.
    var content = stripHtml($('#txtContent').val().trim())
    //Adiciona o conteúdo do comentário ao html.
    $('#txtContent').val(content)
    //Se o comentário tiver sido enviado em branco, retorna falso.
    if (content == '') return false
    //Captura a data e horário do comentário enviado.
    const today = new Date()
    sysdate = today.toISOString().replace('T', ' ').split('.')[0]
    //Verifica na API se o comentário enviado já existe, tanto no conteúdo quanto nos dados do usuário.
    $.get(app.apiBaseURL + 'comments', {
            uid: userData.uid,
            content: content,
            article: artData.id
        })
        .done((data) => {
            //Se um comentário com os mesmos dados já existe, manda uma mensagem de erro.
            if (data.length > 0) {
                //Altera o conteúdo de popUp.
                popUp({ type: 'error', text: 'Ooops! Este comentário já foi enviado antes...' })
                return false
            } else {
                //Caso contrário, cria uma constante com os dados do comentário a ser adicionado.
                const formData = {
                    name: userData.displayName,
                    photo: userData.photoURL,
                    email: userData.email,
                    uid: userData.uid,
                    article: artData.id,
                    content: content,
                    date: sysdate,
                    status: 'on'
                }
                //Realiza um método POST na API "comments" para adicionar o comentário.
                $.post(app.apiBaseURL + 'comments', formData)
                    .done((data) => {
                        //Se o método tiver sucesso, altera o conteúdo de popUp.
                        if (data.id > 0) {
                            popUp({ type: 'success', text: 'Seu comentário foi enviado com sucesso!' })
                            //Carrega o ártigo antes visualizado.
                            loadpage('view')
                        }
                    })
                    .fail((err) => {
                        console.error(err)
                    })

            }
        })

}

function updateViews(artData) {
    //Realiza um método UPDATE através do ajax para atualizar a quantidade de visualizações do artigo.
    $.ajax({
        type: 'PATCH',
        url: app.apiBaseURL + 'articles/' + artData.id,
        //Adiciona +1 no número de views dentro do artigo.
        data: { views: parseInt(artData.views) + 1 }
    });
}