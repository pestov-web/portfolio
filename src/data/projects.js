import linzer from '../images/portfolio/linzer.webp';
import mesto from '../images/portfolio/mesto.webp';
import diploma from '../images/portfolio/diploma.webp';

export const projectsList = [
  {
    id: 1,
    nameRu: 'Linzer',
    nameEn: 'Linzer',
    description:
      'Многостраничный сайт компании "Linzer" переделаный в адаптивный с использованием React из старого статичного сайта.',
    image: linzer,
    ghUrl: 'https://github.com/pestov-web/linzer-react',
    prjUrl: 'https://linzer.su/',
  },

  {
    id: 2,
    nameRu: 'Movies Explorer',
    nameEn: 'Movies Explroer',
    description:
      'Сайт поиска фильмов по каталогу. Дипломный проект студента факультета Веб-разработки, включающий фронтенд и бэкенд части приложения.',
    image: diploma,
    ghUrl: 'https://github.com/pestov-web/movies-explorer-frontend',
    prjUrl: 'https://movies.pestov-web.ru/',
  },
  {
    id: 3,
    nameRu: 'Mesto',
    nameEn: 'Mesto',
    description:
      'Учебный проект "Место", включающий фронтенд и бэкенд части приложения со следующими возможностями: авторизации и регистрации пользователей, операции с карточками и пользователями.',
    image: mesto,
    ghUrl: 'https://github.com/pestov-web/react-mesto-api-full',
    prjUrl: 'https://mesto.pestov-web.ru/',
  },
];
