import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {

  if(request.method === 'POST') { // Só faz a criação do registro se for chamado com método POST
    const TOKEN = `${process.env.DATO_FULL}`;
    const client = new SiteClient(TOKEN);

    const formTitulo = request.body.title;
    const formURL = request.body.url;
    const formImagem = request.body.image;
    const formCreator = request.body.creatorid;
  
    const registroCriado = await client.items.create({
      itemType: '968546', //ID da model criada (Community) para armazenar os dados
      title: formTitulo,
      image: formImagem,
      url: formURL,
      creatorid: formCreator
    })
  
    response.json({
      dados: 'Qualquer dado passado',
      registro: registroCriado
    })

    return
  }

  response.status('404').json({
    message: 'Não existe implementação para o método GET.'
  })
}