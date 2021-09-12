import Banner from './Banner'
import PageIntro from './PageIntro'
import Blog from './Blog'
import Topic from './Topic'
import Menu from './Menu'
import FooterModel from './FooterModel'

export default interface HomePorps {
    menu: Menu[];
    banner: Banner;
    pageIntro: PageIntro;
    topics: Topic[];
    blogs: Blog[];
    footer: FooterModel
} 