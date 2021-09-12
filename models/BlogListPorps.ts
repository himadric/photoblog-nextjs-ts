import PageIntro from './PageIntro'
import Blog from './Blog'
import Menu from './Menu'
import FooterModel from './FooterModel'

export default interface BlogListPorps {
    menu: Menu[];
    pageIntro: PageIntro;
    blogs: Blog[];
    footer: FooterModel
} 