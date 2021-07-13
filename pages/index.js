import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { useEffect, useState } from 'react';

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

export default function Home() {
  const user = 'dimasresende';
  const [comunidades, setComunidades] = useState([]);

  const [seguidores, setSeguidores] = useState([]);
  const pessoasFavoritas = seguidores.slice(0, 6);

  useEffect(async () => {
    const url = `https://api.github.com/users/${user}/followers`;
    const response = await fetch(url);
    setSeguidores(await response.json());
  }, []);

  function handleCriaComunidade(e) {
    e.preventDefault();
    const dadosFormulario = new FormData(e.target);
    const formTitle = dadosFormulario.get('title');
    const formURL = dadosFormulario.get('url') || 'https://github.com';
    const image = 'https://picsum.photos/200/300?' + new Date().getMilliseconds();

    if (formTitle == '') {
      return;
    }

    const comunidade = {
      id: new Date().toISOString(),
      titulo: formTitle,
      url: formURL,
      imagem: image,
    }

    const comunidadesAtualizada = [...comunidades, comunidade];
    document.getElementById('textTitulo').value = '';
    document.getElementById('textURL').value = '';

    setComunidades(comunidadesAtualizada);
  };

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={user} />
        </div>
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
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`${itemAtual.url}`}>
                      <img src={`${itemAtual.imagem}`} />
                      <span>{itemAtual.titulo}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
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
