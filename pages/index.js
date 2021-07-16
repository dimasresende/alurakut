import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { useEffect, useState } from 'react';
import nookies from 'nookies';

function ProfileSidebar(props) {
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>@{props.githubUser}</a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home(props) {
  const user = props.githubUser;
  const [comunidades, setComunidades] = useState([]);

  const [seguidores, setSeguidores] = useState([]);
  const pessoasFavoritas = seguidores.slice(0, 6);

  useEffect(async () => {
    //Seguidores do Github
    const urlFollowers = `https://api.github.com/users/${user}/followers`;
    const response = await fetch(urlFollowers);
    setSeguidores(await response.json());
    
    //API do DatoCMS (GraphQL) para pegar as comunidades cadastradas
    const urlDato = `https://graphql.datocms.com/`;
    const responseComunidade = await fetch(urlDato, {
      method: 'POST',
      headers: {
        'Authorization': `${process.env.DATO_READ}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          image
          url
          creatorid
        }
      }`})
    });
    const retornoComunidades = await responseComunidade.json();
    setComunidades(retornoComunidades.data.allCommunities);


  }, []);

  async function handleCriaComunidade(e) {
    e.preventDefault();
    const dadosFormulario = new FormData(e.target);
    const formTitle = dadosFormulario.get('title');
    const formURL = dadosFormulario.get('url') || 'https://github.com';
    const imagem = 'https://picsum.photos/200/300?' + new Date().getMilliseconds();
    const idUsuario = `${user}`;

    if (formTitle == '') {
      return;
    }

    const criaComunidade = {
      title: formTitle,
      url: formURL,
      image: imagem,
      creatorid: idUsuario,
    }

    const comunidadeCriada = await fetch('/api/comunidades/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(criaComunidade)
    })

    // const comunidade = await comunidadeCriada.json();
    const comunidadeEnviada = await comunidadeCriada.json();
    const comunidade = comunidadeEnviada.registro;

    const comunidadesAtualizada = [...comunidades, comunidade];
    document.getElementById('textTitulo').value = '';
    document.getElementById('textURL').value = '';

    setComunidades(comunidadesAtualizada);
  };

  function ProfileRelationsBox(props) {
    return (
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {props.title} ({props.items.length})
        </h2>

        <ul>
          {props.items.map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a href={`${itemAtual.url}`}>
                  <img src={`${itemAtual.image}`} />
                  <span>{itemAtual.title}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </ProfileRelationsBoxWrapper>
    )
  }

  return (
    <>
      <AlurakutMenu githubUser={user} />
      <MainGrid>
        <aside className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={user} />
        </aside>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo(a)

              <OrkutNostalgicIconSet />
            </h1>
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCriaComunidade}>
              <div>
                <input id="textTitulo" type="text" placeholder="Qual vai ser o nome da sua comunidade?" name="title" aria-label="Qual vai ser o nome da sua comunidade?" />
              </div>
              <div>
                <input id="textURL" type="text" placeholder="Coloque a url da sua comunidade." name="url" aria-label="Coloque a url da sua comunidade." />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBox title="Comunidades" items={comunidades} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({seguidores.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`${itemAtual.html_url}`}>
                      <img src={`https://github.com/${itemAtual.login}.png`} />
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookie = nookies.get(context);
  const token = cookie.USER_TOKEN;

  return {
    props: {
      githubUser: 'dimasresende'
    }, // will be passed to the page component as props
  }
}
